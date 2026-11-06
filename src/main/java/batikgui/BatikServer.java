package batikgui;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.riot.RDFDataMgr;

import java.awt.Desktop;
import java.io.File;
import java.io.InputStream;
import java.net.BindException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

/** Server lokal: Jena membaca ontologi, hasilnya disajikan sebagai JSON untuk halaman web (index.html). */
public class BatikServer {

    static final String NS = "http://www.semanticweb.org/asus/ontologies/2026/8/untitled-ontology-3#";

    public static void main(String[] args) throws Exception {
        File f = cariFile(args);
        if (f == null) { System.err.println("File .rdf/.owl tidak ditemukan di folder project."); return; }
        Model m = RDFDataMgr.loadModel(f.getAbsolutePath());
        byte[] json = buildJson(m).getBytes(StandardCharsets.UTF_8);
        byte[] html = muatHtml();

        HttpServer srv = null;
        int port = 8080;
        for (; port < 8090; port++) {
            try { srv = HttpServer.create(new InetSocketAddress("localhost", port), 0); break; }
            catch (BindException e) { /* coba port berikutnya */ }
        }
        if (srv == null) { System.err.println("Port 8080-8089 terpakai."); return; }

        // Route static assets and SPA
        srv.createContext("/", ex -> {
            String path = ex.getRequestURI().getPath();
            if (path.equals("/") || path.equals("/index.html")) {
                kirim(ex, 200, "text/html; charset=utf-8", muatHtml());
                return;
            }
            byte[] fileBytes = cariResource(path);
            if (fileBytes != null) {
                String mime = tentukanMime(path);
                kirim(ex, 200, mime, fileBytes);
                return;
            }
            // Jika rute frontend (SPA routing tanpa ekstensi file), kirim index.html
            if (!path.contains(".")) {
                kirim(ex, 200, "text/html; charset=utf-8", muatHtml());
                return;
            }
            kirim(ex, 404, "text/plain", "404 Not Found".getBytes(StandardCharsets.UTF_8));
        });

        srv.createContext("/api/batik", ex -> kirim(ex, 200, "application/json; charset=utf-8", json));
        srv.createContext("/img/", ex -> {
            String path = ex.getRequestURI().getPath().replaceFirst("^/img/", "");
            String id = path.replaceAll("[^A-Za-z0-9_]", "");
            for (String ext : new String[]{"svg", "png", "jpg", "jpeg", "webp", "gif"}) {
                String fileName = id + "." + ext;
                // Coba muat dari classpath
                try (InputStream in = BatikServer.class.getResourceAsStream("/gambar/" + fileName)) {
                    if (in != null) {
                        String mime = ext.equals("svg") ? "image/svg+xml" : (ext.equals("jpg") ? "image/jpeg" : "image/" + ext);
                        kirim(ex, 200, mime, in.readAllBytes());
                        return;
                    }
                } catch (Exception ignored) {}

                // Coba muat dari direktori file fisik
                for (String folder : new String[]{"gambar", "src/main/resources/gambar", "target/classes/gambar"}) {
                    File img = new File(folder, fileName);
                    if (img.exists() && img.isFile()) {
                        String mime = ext.equals("svg") ? "image/svg+xml" : (ext.equals("jpg") ? "image/jpeg" : "image/" + ext);
                        kirim(ex, 200, mime, Files.readAllBytes(img.toPath()));
                        return;
                    }
                }
            }
            kirim(ex, 404, "text/plain", new byte[0]);
        });
        srv.start();
        String url = "http://localhost:" + port;
        System.out.println("=================================================");
        System.out.println(" BATIK NUSANTARA GUI (Next.js / Web Semantik)   ");
        System.out.println(" Berjalan di: " + url);
        System.out.println(" Data Ontologi: " + f.getName());
        System.out.println("=================================================");
        try { Desktop.getDesktop().browse(new URI(url)); } catch (Exception ignored) { }
    }

    static byte[] muatHtml() {
        try (InputStream in = BatikServer.class.getResourceAsStream("/index.html")) {
            if (in != null) return in.readAllBytes();
        } catch (Exception ignored) {}

        for (String lokasi : new String[]{
            "src/main/resources/index.html",
            "out/index.html",
            "index.html",
            "public/index.html"
        }) {
            File f = new File(lokasi);
            if (f.exists() && f.isFile()) {
                try { return Files.readAllBytes(f.toPath()); } catch (Exception ignored) {}
            }
        }

        String fallback = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Batik GUI</title></head>"
                + "<body style='font-family:sans-serif;padding:40px;text-align:center;background:#faf7f2;color:#3e2723;'>"
                + "<h2>Server Batik Berjalan</h2>"
                + "<p>Berkas index.html sedang dimuat atau dibangun. Silakan muat ulang halaman ini dalam beberapa detik.</p>"
                + "</body></html>";
        return fallback.getBytes(StandardCharsets.UTF_8);
    }

    static byte[] cariResource(String path) {
        if (path.startsWith("/")) path = path.substring(1);
        try (InputStream in = BatikServer.class.getResourceAsStream("/" + path)) {
            if (in != null) return in.readAllBytes();
        } catch (Exception ignored) {}

        for (String folder : new String[]{"src/main/resources", "out", "public", "."}) {
            File f = new File(folder, path);
            if (f.exists() && f.isFile()) {
                try { return Files.readAllBytes(f.toPath()); } catch (Exception ignored) {}
            }
        }
        return null;
    }

    static String tentukanMime(String path) {
        String p = path.toLowerCase();
        if (p.endsWith(".html")) return "text/html; charset=utf-8";
        if (p.endsWith(".js") || p.endsWith(".mjs")) return "application/javascript; charset=utf-8";
        if (p.endsWith(".css")) return "text/css; charset=utf-8";
        if (p.endsWith(".json")) return "application/json; charset=utf-8";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".webp")) return "image/webp";
        if (p.endsWith(".ico")) return "image/x-icon";
        if (p.endsWith(".woff2")) return "font/woff2";
        if (p.endsWith(".woff")) return "font/woff";
        if (p.endsWith(".ttf")) return "font/ttf";
        return "application/octet-stream";
    }

    static void kirim(HttpExchange ex, int code, String type, byte[] body) throws java.io.IOException {
        ex.getResponseHeaders().set("Content-Type", type);
        ex.sendResponseHeaders(code, body.length == 0 ? -1 : body.length);
        if (body.length > 0) ex.getResponseBody().write(body);
        ex.close();
    }

    static File cariFile(String[] args) {
        if (args.length > 0) return new File(args[0]);
        for (String n : new String[]{"batik-lengkap.rdf", "batik.owl", "batik.rdf"}) {
            File f = new File(n);
            if (f.exists()) return f;
        }
        File[] fs = new File(".").listFiles((d, n) -> n.endsWith(".rdf") || n.endsWith(".owl"));
        return (fs != null && fs.length > 0) ? fs[0] : null;
    }

    /** Satu query SPARQL menghasilkan pasangan (batik, kunci, nilai) dari seluruh relasi ontologi. */
    static String buildJson(Model m) {
        String q = "PREFIX : <" + NS + ">\n"
                + "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n"
                + "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n"
                + "SELECT ?b ?k ?v WHERE { ?b :namaBatik ?n . {\n"
                + "  { ?b ?p ?v . FILTER(isLiteral(?v)) BIND(STRAFTER(STR(?p), \"#\") AS ?k) }\n"
                + "  UNION { ?b :berasalDari/:namaWilayah ?v . BIND(\"daerah\" AS ?k) }\n"
                + "  UNION { ?b :berasalDari/:pulau ?v . BIND(\"pulau\" AS ?k) }\n"
                + "  UNION { ?b :berasalDari/:terletakdiProvinsi/:namaWilayah ?v . BIND(\"provinsi\" AS ?k) }\n"
                + "  UNION { ?b :dibuatDenganTeknik/:namaTeknik ?v . BIND(\"teknik\" AS ?k) }\n"
                + "  UNION { ?b :dibuatDenganTeknik/:alatUtama ?v . BIND(\"alat\" AS ?k) }\n"
                + "  UNION { ?b :memilikiMotif/:namaMotif ?v . BIND(\"motif\" AS ?k) }\n"
                + "  UNION { ?b :memilikiMotif/:maknaMotif ?v . BIND(\"maknaMotif\" AS ?k) }\n"
                + "  UNION { ?b :memilikiKegunaan/:namaAcara ?v . BIND(\"acara\" AS ?k) }\n"
                + "  UNION { ?b :menggunakanPewarnaan/:namaPewarna ?v . BIND(\"pewarna\" AS ?k) }\n"
                + "  UNION { ?b :menggunakanPewarnaan/:sumberPewarna ?v . BIND(\"sumberPewarna\" AS ?k) }\n"
                + "  UNION { ?b :menggunakanBahanMalam/:jenisMalam ?v . BIND(\"malam\" AS ?k) }\n"
                // nama kelas + kelas induk (flora -> motif, pernikahan -> adat -> kegunaan, dst.)
                + "  UNION { ?b (:memilikiKegunaan|:berasalDari|:memilikiMotif|:menggunakanPewarnaan|:dibuatDenganTeknik)?"
                + "/rdf:type/rdfs:subClassOf* ?c . FILTER(STRSTARTS(STR(?c), \"" + NS + "\"))\n"
                + "    BIND(STRAFTER(STR(?c), \"#\") AS ?v) BIND(\"kelas\" AS ?k) }\n"
                + "} }";
        Map<String, Map<String, Set<String>>> data = new TreeMap<>();
        try (QueryExecution qe = QueryExecutionFactory.create(q, m)) {
            ResultSet rs = qe.execSelect();
            while (rs.hasNext()) {
                QuerySolution s = rs.nextSolution();
                String id = s.getResource("b").getURI();
                id = id.substring(id.indexOf('#') + 1);
                data.computeIfAbsent(id, x -> new LinkedHashMap<>())
                    .computeIfAbsent(s.getLiteral("k").getLexicalForm(), x -> new LinkedHashSet<>())
                    .add(s.getLiteral("v").getLexicalForm());
            }
        }
        StringBuilder sb = new StringBuilder("[");
        boolean firstB = true;
        for (Map.Entry<String, Map<String, Set<String>>> e : data.entrySet()) {
            sb.append(firstB ? "" : ",").append("{\"id\":").append(js(e.getKey()));
            firstB = false;
            for (Map.Entry<String, Set<String>> kv : e.getValue().entrySet()) {
                sb.append(',').append(js(kv.getKey())).append(":[");
                boolean fv = true;
                for (String v : kv.getValue()) { sb.append(fv ? "" : ",").append(js(v)); fv = false; }
                sb.append(']');
            }
            sb.append('}');
        }
        return sb.append(']').toString();
    }

    static String js(String s) {
        StringBuilder b = new StringBuilder("\"");
        for (char c : s.toCharArray()) {
            switch (c) {
                case '"': b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n"); break;
                case '\r': b.append("\\r"); break;
                case '\t': b.append("\\t"); break;
                default: if (c < 0x20) b.append(String.format("\\u%04x", (int) c)); else b.append(c);
            }
        }
        return b.append('"').toString();
    }
}