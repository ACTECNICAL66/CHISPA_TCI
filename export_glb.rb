# export_glb.rb — Automatiza: abrir SKP y exportar GLB nativo (SketchUp 2024+)
LOG = 'C:/Users/eddie/Desktop/AC/A olvidar/tci oniet/sketch_log.txt'
SKP = 'C:/Users/eddie/Desktop/AC/A olvidar/tci oniet/BIBLIOTECA-TCI.skp'
GLB = 'C:/Users/eddie/Desktop/AC/A olvidar/tci oniet/chispa.glb'

def log(msg)
  File.open(LOG, 'a') { |f| f.puts "[#{Time.now.strftime('%H:%M:%S')}] #{msg}" }
end

begin
  File.delete(LOG) if File.exist?(LOG)
  log 'inicio'
  model = Sketchup.active_model
  log "modelo activo: '#{model.title}' path: #{model.path.inspect}"
  if model.path.empty? || File.basename(model.path).downcase != 'biblioteca-tci.skp'
    log 'abriendo skp explicitamente...'
    Sketchup.open_file(SKP)
    model = Sketchup.active_model
    log "modelo ahora: '#{model.title}' path: #{model.path.inspect}"
  end
  log "entidades raiz: #{model.entities.count}"
  bb = model.bounds
  log format('bounds (pulgadas): %.1f x %.1f x %.1f', bb.width, bb.depth, bb.height)
  pages = model.pages
  log "paginas/escenas: #{pages.count}"
  pages.each do |p|
    cam = p.camera
    log "  escena '#{p.name}': eye=#{cam.eye.to_a.inspect} target=#{cam.target.to_a.inspect}"
  end
  log "exportando GLB -> #{GLB}"
  ok = model.export(GLB)
  size = File.exist?(GLB) ? File.size(GLB) : 'NO EXISTE'
  log "export glb => #{ok.inspect} tamano: #{size}"
rescue => e
  log "ERROR: #{e.class}: #{e.message}"
  e.backtrace.each { |l| log "  #{l}" }
end
log 'fin, saliendo'
Sketchup.quit
