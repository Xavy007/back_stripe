const htmlPdf = require('html-pdf-node');
const fs = require('fs');
const path = require('path');
const PartidoDigital = require('../../models/mongodb/PartidoDigital');
const formacionesService = require('./formacionesSets.service');
const sustitucionesService = require('./substitucionesPartido.service');
const timeoutsService = require('./timeoutsPartido.service');
const sancionesService = require('./sancionesPartido.service');
const setsPartidoService = require('./setsPartido.service');

class PlanillaGeneradorService {

  async generarPlanillaPDF(idpartido, opciones = {}) {
    try {
      const html = await this.generarPlanillaHTML(idpartido, opciones);
      
      const uploadsDir = path.join(__dirname, '../../uploads/planillas');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const filename = `planilla_FIVB_${idpartido}_${Date.now()}.pdf`;
      const filepath = path.join(uploadsDir, filename);

      const options = {
        format: 'A4',
        landscape: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        printBackground: true,
        preferCSSPageSize: true
      };

      const file = { content: html };
      const pdfBuffer = await htmlPdf.generatePdf(file, options);
      fs.writeFileSync(filepath, pdfBuffer);

      return { filename, filepath, url: `/uploads/planillas/${filename}` };
    } catch (error) {
      throw new Error(`Error generando PDF: ${error.message}`);
    }
  }

  async generarPlanillaHTML(idpartido, opciones = {}) {
    try {
      const datos = await this._obtenerDatosCompletos(idpartido);
      return this._generarHTMLOficialFIVB(datos, opciones);
    } catch (error) {
      throw new Error(`Error HTML: ${error.message}`);
    }
  }

  async _obtenerDatosCompletos(idpartido) {
    const partido = await PartidoDigital.findOne({ idpartido: parseInt(idpartido) });
    if (!partido) throw new Error('Partido no encontrado');
    
    const sets = await setsPartidoService.obtenerPorPartido(idpartido);
    const datosPorSet = [];
    
    // Generar estructura para 5 sets fijos (FIVB estándar)
    for (let i = 1; i <= 5; i++) {
       const set = sets.find(s => s.numero_set === i);
       if (set) {
           const formacionCompleta = await formacionesService.obtenerFormacion(idpartido, i).catch(() => null);
           const formaciones = formacionCompleta 
              ? { local: [formacionCompleta.formacion_local], visitante: [formacionCompleta.formacion_visitante] } 
              : { local: [], visitante: [] };
           
           const sustituciones = (await sustitucionesService.obtenerSubstitucionesSet(idpartido, i).catch(() => [])) || [];
           const timeouts = (await timeoutsService.obtenerTimeoutsSet(idpartido, i).catch(() => [])) || [];
           
           datosPorSet.push({ set, formaciones, sustituciones, timeouts, jugado: true });
       } else {
           datosPorSet.push({ 
             set: { numero_set: i }, 
             formaciones: { local: [], visitante: [] }, 
             sustituciones: [], 
             timeouts: [], 
             jugado: false 
           });
       }
    }
    
    const sanciones = (await sancionesService.obtenerSancionesPartido(idpartido).catch(() => [])) || [];
    return { partido, sets, datosPorSet, sanciones };
  }

  // =======================================================================
  //  DISEÑO FIVB COMPLETO Y PROFESIONAL
  // =======================================================================

  _generarHTMLOficialFIVB(datos, opciones = {}) {
    const { partido, datosPorSet, sanciones } = datos;
    const { modo = 5 } = opciones; // modo 3 o 5 sets
    const eqA = partido.equipos.local;
    const eqB = partido.equipos.visitante;
    
    const fecha = new Date(partido.info_general.fecha_programada).toLocaleDateString('es-ES');
    const hora = partido.info_general.hora_inicio_real 
       ? new Date(partido.info_general.hora_inicio_real).toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'}) 
       : '--:--';
    const categoria = partido.info_general.categoria || 'MAYORES';
    const genero = partido.info_general.genero || 'MASCULINO';

    const css = `
      <style>
        @page { size: A4 landscape; margin: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: Arial, Helvetica, sans-serif; 
          margin: 0; 
          padding: 3mm; 
          width: 297mm; 
          height: 210mm; 
          font-size: 7px;
          background: #fff;
          color: #000;
        }

        .sheet-container { 
          width: 100%; 
          height: 100%; 
          border: 2px solid #000; 
          display: flex; 
          flex-direction: column;
          background: white;
        }

        /* MODO 3 SETS - Oculta sets 4 y 5 */
        .mode-3-sets .set-row:nth-child(4),
        .mode-3-sets .set-row:nth-child(5) {
          display: none;
        }
        .mode-3-sets .set-row {
          flex: 1.66;
        }

        /* ========== HEADER ========== */
        .header-section {
          height: 22mm;
          border-bottom: 2px solid #000;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .header-row {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          border-bottom: 1px solid #000;
        }
        .header-row:last-child {
          border-bottom: none;
        }

        .h-cell {
          border-right: 1px solid #000;
          padding: 2px 4px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .h-cell:last-child {
          border-right: none;
        }

        .h-label {
          font-size: 5px;
          text-transform: uppercase;
          color: #666;
          font-weight: bold;
          margin-bottom: 1px;
        }

        .h-value {
          font-size: 8px;
          font-weight: bold;
          color: #000;
        }

        .team-indicator {
          width: 16px;
          height: 16px;
          border: 2px solid #000;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          margin-right: 4px;
          background: white;
        }

        .logo-fivb {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 40px;
          height: 40px;
          border: 1px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: bold;
          background: white;
          z-index: 10;
          flex-direction: column;
        }

        /* ========== SETS ========== */
        .main-content {
          flex: 1;
          display: flex;
          min-height: 0;
        }

        .sets-container {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .set-row {
          flex: 1;
          display: flex;
          border-bottom: 1px solid #000;
          min-height: 0;
        }
        .set-row:last-child {
          border-bottom: none;
        }

        /* Estructura del set */
        .set-team-left {
          display: grid;
          grid-template-columns: 50px 1fr 60px;
          border-right: 2px solid #000;
          flex: 1;
        }

        .set-center {
          width: 70px;
          border-right: 2px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          font-size: 28px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .set-team-right {
          display: grid;
          grid-template-columns: 60px 1fr 50px;
          flex: 1;
        }

        /* Columna de tiempos */
        .time-col {
          border-right: 1px solid #000;
          display: flex;
          flex-direction: column;
          background: linear-gradient(to bottom, #f8f8f8, #ececec);
          padding: 2px;
        }

        .time-block {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid #ccc;
        }
        .time-block:last-child {
          border-bottom: none;
        }

        .time-label {
          font-size: 5px;
          color: #666;
          text-transform: uppercase;
          font-weight: bold;
        }

        .time-value {
          font-size: 9px;
          font-weight: bold;
          margin-top: 1px;
          background: white;
          padding: 1px 3px;
          border: 1px solid #ccc;
          border-radius: 2px;
        }

        /* Área de rotaciones */
        .rotation-area {
          border-right: 1px solid #000;
          display: flex;
          flex-direction: column;
        }

        .rotation-header {
          height: 16px;
          background: linear-gradient(to bottom, #e8e8e8, #d0d0d0);
          border-bottom: 1px solid #000;
          display: flex;
          align-items: center;
          padding: 0 4px;
          font-size: 7px;
          font-weight: bold;
        }

        .rotation-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: auto auto 1fr;
          position: relative;
        }

        .pos-header {
          border-right: 1px solid #ccc;
          border-bottom: 1px solid #000;
          text-align: center;
          font-size: 7px;
          font-weight: bold;
          padding: 2px 0;
          background: #f8f8f8;
        }
        .pos-header:last-child {
          border-right: none;
        }

        .dorsal-cell {
          border-right: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          text-align: center;
          font-size: 13px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          position: relative;
        }
        .dorsal-cell:nth-child(12n) {
          border-right: none;
        }

        .captain-mark {
          position: absolute;
          top: 1px;
          right: 2px;
          font-size: 6px;
          color: #c00;
          font-weight: bold;
        }

        .subs-cell {
          border-right: 1px solid #ccc;
          font-size: 6px;
          padding: 2px 1px;
          display: flex;
          flex-direction: column;
          gap: 1px;
          align-items: center;
          background: #fafafa;
        }
        .subs-cell:nth-child(6n) {
          border-right: none;
        }

        .sub-entry {
          font-size: 6px;
          white-space: nowrap;
          background: white;
          border: 1px solid #ddd;
          border-radius: 2px;
          padding: 1px 2px;
        }

        /* Timeouts box */
        .timeouts-box {
          position: absolute;
          bottom: 3px;
          width: 35px;
          height: 26px;
          border: 2px solid #000;
          background: #fff;
          display: flex;
          flex-direction: column;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .timeouts-box.left {
          right: 3px;
        }
        .timeouts-box.right {
          left: 3px;
        }
        .to-title {
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          text-align: center;
          font-size: 6px;
          font-weight: bold;
          background: #fff;
          padding: 0 2px;
          border: 1px solid #000;
        }
        .to-row {
          flex: 1;
          border-bottom: 1px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 7px;
          font-weight: bold;
        }
        .to-row:last-child {
          border-bottom: none;
        }
        .to-row.used {
          background: #fff3cd;
        }

        /* Columna de puntos */
        .points-col {
          display: flex;
          flex-direction: column;
        }

        .points-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 1fr;
        }

        .point-cell {
          border-right: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 6px;
          color: #ccc;
          background: white;
        }
        .point-cell:nth-child(4n) {
          border-right: none;
        }

        .point-cell.active {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          color: #000;
          font-weight: bold;
          border-color: #28a745;
        }

        /* ========== FOOTER ========== */
        .footer-section {
          height: 45mm;
          display: grid;
          grid-template-columns: 24% 38% 38%;
          border-top: 2px solid #000;
        }

        .footer-col {
          border-right: 2px solid #000;
          display: flex;
          flex-direction: column;
        }
        .footer-col:last-child {
          border-right: none;
        }

        .footer-title {
          background: linear-gradient(to bottom, #2c3e50, #34495e);
          color: white;
          text-align: center;
          font-size: 7px;
          font-weight: bold;
          padding: 3px;
          text-transform: uppercase;
          border-bottom: 1px solid #000;
        }

        table.std-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 6px;
        }

        table.std-table th {
          background: linear-gradient(to bottom, #e8e8e8, #d0d0d0);
          border: 1px solid #000;
          padding: 2px;
          font-weight: bold;
        }

        table.std-table td {
          border: 1px solid #000;
          padding: 2px;
          text-align: center;
        }

        table.std-table td.highlight {
          background: #fff3cd;
          font-weight: bold;
        }

        .bg-grey {
          background: linear-gradient(to bottom, #f5f5f5, #e8e8e8) !important;
        }

        .obs-content {
          flex: 1;
          padding: 4px;
          font-size: 6px;
          line-height: 1.3;
          border-bottom: 1px solid #000;
          overflow: auto;
        }

        .firmas-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr 1fr;
          gap: 2px;
          padding: 3px;
          flex: 1;
        }

        .firma-box {
          border: 1px solid #000;
          display: flex;
          flex-direction: column;
          padding: 2px;
          font-size: 5.5px;
          text-align: center;
        }

        .firma-label {
          font-weight: bold;
          margin-bottom: 2px;
          font-size: 5px;
        }

        .ganador-box {
          padding: 6px;
          text-align: center;
          background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
          border-top: 2px solid #000;
          margin-top: auto;
          border-left: 3px solid #28a745;
        }

        .ganador-team {
          font-size: 10px;
          font-weight: bold;
          margin: 3px 0;
        }

        .ganador-score {
          font-size: 16px;
          font-weight: bold;
          color: #28a745;
        }
      </style>
    `;

    // Aplicar clase de modo
    const modoClass = modo === 3 ? 'mode-3-sets' : '';

    const headerHTML = this._renderHeader(partido, eqA, eqB, fecha, hora, categoria, genero);
    const setsHTML = this._renderSets(datosPorSet, eqA, eqB);
    const footerHTML = this._renderFooter(partido, datosPorSet, sanciones, eqA, eqB);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          ${css}
        </head>
        <body>
          <div class="sheet-container ${modoClass}">
             ${headerHTML}
             ${setsHTML}
             ${footerHTML}
          </div>
        </body>
      </html>
    `;
  }

  _renderHeader(partido, eqA, eqB, fecha, hora, categoria, genero) {
    return `
      <div class="header-section">
        <div class="header-row">
          <div class="h-cell" style="grid-column: span 2;">
            <div class="h-label">Nombre de la Competencia</div>
            <div class="h-value">CAMPEONATO ${partido.info_general.nombre_torneo || 'OFICIAL 2025'}</div>
          </div>
          <div class="h-cell">
            <div class="h-label">Ciudad</div>
            <div class="h-value">${partido.info_general.lugar || 'TARIJA'}</div>
          </div>
          <div class="h-cell">
            <div class="h-label">País</div>
            <div class="h-value">BOL</div>
          </div>
          <div class="h-cell">
            <div class="h-label">Partido N°</div>
            <div class="h-value">${partido.idpartido}</div>
          </div>
          <div class="h-cell">
            <div class="h-label">Fecha</div>
            <div class="h-value">${fecha}</div>
          </div>
          <div class="h-cell">
            <div class="h-label">Hora</div>
            <div class="h-value">${hora}</div>
          </div>
        </div>

        <div class="header-row">
          <div class="h-cell" style="grid-column: span 3;">
            <div class="h-label">Equipos</div>
            <div style="display: flex; gap: 10px; align-items: center; margin-top: 2px;">
              <div style="display: flex; align-items: center;">
                <span class="team-indicator">A</span>
                <span class="h-value" style="font-size: 8px;">${eqA.nombre}</span>
              </div>
              <span style="font-weight: bold; font-size: 12px;">VS</span>
              <div style="display: flex; align-items: center;">
                <span class="team-indicator">B</span>
                <span class="h-value" style="font-size: 8px;">${eqB.nombre}</span>
              </div>
            </div>
          </div>
          <div class="h-cell">
            <div class="h-label">Fase</div>
            <div class="h-value">${partido.info_general.fase || 'ÚNICA'}</div>
          </div>
          <div class="h-cell" style="grid-column: span 2;">
            <div class="h-label">División</div>
            <div class="h-value">${genero}</div>
          </div>
          <div class="h-cell">
            <div class="h-label">Categoría</div>
            <div class="h-value">${categoria}</div>
          </div>
        </div>

        <div class="logo-fivb">
          <div>FIVB</div>
          <div style="font-size: 5px;">Official</div>
        </div>
      </div>
    `;
  }

  _renderSets(datosPorSet, eqA, eqB) {
    let html = '<div class="main-content"><div class="sets-container">';
    
    datosPorSet.forEach(d => {
      html += this._renderSetRow(d, eqA, eqB);
    });
    
    html += '</div></div>';
    return html;
  }

  _renderSetRow(datos, eqA, eqB) {
    const { set, formaciones, sustituciones, timeouts, jugado } = datos;
    const numSet = set.numero_set;

    const formA = formaciones.local[0]?.posiciones || [];
    const subsA = sustituciones.filter(s => s.equipo === 'local');
    const timesA = timeouts.filter(t => t.equipo === 'local');
    const ptsA = jugado ? (set.puntos_local || 0) : 0;

    const formB = formaciones.visitante[0]?.posiciones || [];
    const subsB = sustituciones.filter(s => s.equipo === 'visitante');
    const timesB = timeouts.filter(t => t.equipo === 'visitante');
    const ptsB = jugado ? (set.puntos_visitante || 0) : 0;

    const tStart = jugado && set.hora_inicio ? new Date(set.hora_inicio).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--';
    const tEnd = jugado && set.hora_fin ? new Date(set.hora_fin).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--';

    return `
      <div class="set-row">
        <div class="set-team-left">
          <div class="time-col">
            <div class="time-block">
              <div class="time-label">Inicio</div>
              <div class="time-value">${tStart}</div>
            </div>
            <div class="time-block">
              <div class="time-label">Final</div>
              <div class="time-value">${tEnd}</div>
            </div>
          </div>
          <div class="rotation-area">
            <div class="rotation-header">
              <span class="team-indicator">A</span>
              <span>${eqA.nombre}</span>
            </div>
            ${this._renderRotationGrid(formA, subsA, timesA, 'left')}
          </div>
          <div class="points-col">
            ${this._renderPointsGrid(ptsA)}
          </div>
        </div>

        <div class="set-center">${numSet}</div>

        <div class="set-team-right">
          <div class="points-col">
            ${this._renderPointsGrid(ptsB)}
          </div>
          <div class="rotation-area">
            <div class="rotation-header">
              <span class="team-indicator">B</span>
              <span>${eqB.nombre}</span>
            </div>
            ${this._renderRotationGrid(formB, subsB, timesB, 'right')}
          </div>
          <div class="time-col">
            <div class="time-block">
              <div class="time-label">Inicio</div>
              <div class="time-value">${tStart}</div>
            </div>
            <div class="time-block">
              <div class="time-label">Final</div>
              <div class="time-value">${tEnd}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderRotationGrid(posiciones, sustituciones, timeouts, side) {
    const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    let html = '<div class="rotation-grid">';
    
    // Headers
    for (let i = 0; i < 6; i++) {
      html += `<div class="pos-header">${romanos[i]}</div>`;
    }
    
    // Dorsales
    for (let i = 1; i <= 6; i++) {
      const p = posiciones.find(x => x.posicion === i);
      const dorsal = p ? p.numero_dorsal : '';
      const esCap = p?.es_capitan;
      html += `
        <div class="dorsal-cell">
          ${dorsal}
          ${esCap ? '<span class="captain-mark">C</span>' : ''}
        </div>
      `;
    }
    
    // Sustituciones
    for (let i = 1; i <= 6; i++) {
      const p = posiciones.find(x => x.posicion === i);
      const dorsal = p ? p.numero_dorsal : '';
      const subs = sustituciones.filter(s => 
        s.jugador_sale.dorsal == dorsal || s.posicion_rotacion == i
      );
      
      let subsHTML = '';
      subs.forEach(s => {
        const marcador = `${s.marcador_entra.local}:${s.marcador_entra.visitante}`;
        subsHTML += `<div class="sub-entry"><b>${s.jugador_entra.dorsal}</b> • ${marcador}</div>`;
      });
      
      html += `<div class="subs-cell">${subsHTML}</div>`;
    }
    
    // Timeouts box
    const t1 = timeouts[0] ? `${timeouts[0].puntos_local}:${timeouts[0].puntos_visitante}` : '';
    const t2 = timeouts[1] ? `${timeouts[1].puntos_local}:${timeouts[1].puntos_visitante}` : '';
    const posClass = side === 'left' ? 'left' : 'right';
    const used1 = t1 ? 'used' : '';
    const used2 = t2 ? 'used' : '';
    
    html += `
      <div class="timeouts-box ${posClass}">
        <div class="to-title">T.O.</div>
        <div class="to-row ${used1}">${t1}</div>
        <div class="to-row ${used2}">${t2}</div>
      </div>
    `;
    
    html += '</div>';
    return html;
  }

  _renderPointsGrid(puntos) {
    let html = '<div class="points-grid">';
    for (let i = 1; i <= 48; i++) {
      const active = i <= puntos ? 'active' : '';
      html += `<div class="point-cell ${active}">${i}</div>`;
    }
    html += '</div>';
    return html;
  }

  _renderFooter(partido, datosPorSet, sanciones, eqA, eqB) {
    // Sanciones
    let sanRows = '';
    for (let i = 0; i < 8; i++) {
      const s = sanciones[i];
      sanRows += `<tr>
        <td>${s ? s.tipo_sancion.charAt(0).toUpperCase() : ''}</td>
        <td>${s ? s.sancionado?.dorsal : ''}</td>
        <td>${s ? (s.equipo === 'local' ? 'A' : 'B') : ''}</td>
        <td>${s ? s.numero_set : ''}</td>
        <td>${s ? `${s.puntos_local}:${s.puntos_visitante}` : ''}</td>
      </tr>`;
    }

    // Resultados
    let resRows = '';
    let totDur = 0, totA = 0, totB = 0, wA = 0, wB = 0;
    datosPorSet.forEach(d => {
      if (d.jugado && d.set.puntos_local !== undefined) {
        const s = d.set;
        totDur += s.duracion_minutos || 0;
        totA += s.puntos_local;
        totB += s.puntos_visitante;
        if (s.ganador === 'local') wA++;
        if (s.ganador === 'visitante') wB++;
        
        resRows += `<tr>
          <td>${s.numero_set}</td>
          <td>${s.duracion_minutos || ''}</td>
          <td class="${s.ganador === 'local' ? 'highlight' : ''}">${s.puntos_local}</td>
          <td class="${s.ganador === 'visitante' ? 'highlight' : ''}">${s.puntos_visitante}</td>
          <td>${sustituciones.filter(x => x.equipo === 'local' && x.numero_set === s.numero_set).length}</td>
          <td>${sustituciones.filter(x => x.equipo === 'visitante' && x.numero_set === s.numero_set).length}</td>
          <td>${timeouts.filter(x => x.equipo === 'local' && x.numero_set === s.numero_set).length}</td>
          <td>${timeouts.filter(x => x.equipo === 'visitante' && x.numero_set === s.numero_set).length}</td>
          <td>${s.ganador === 'local' ? '✓' : ''}</td>
          <td>${s.ganador === 'visitante' ? '✓' : ''}</td>
        </tr>`;
      } else {
        resRows += `<tr><td>${d.set.numero_set}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
      }
    });
    resRows += `<tr class="bg-grey"><td><b>TOT</b></td><td><b>${totDur}</b></td><td><b>${totA}</b></td><td><b>${totB}</b></td><td colspan="4"></td><td><b>${wA}</b></td><td><b>${wB}</b></td></tr>`;

    const ganadorNombre = partido.estado_partido.ganador === 'local' ? eqA.nombre : 
                         (partido.estado_partido.ganador === 'visitante' ? eqB.nombre : 'PENDIENTE');

    return `
      <div class="footer-section">
        <div class="footer-col">
          <div class="footer-title">Sanciones Aplicadas</div>
          <table class="std-table">
            <tr><th>Tipo</th><th>N° Jug</th><th>Eq</th><th>Set</th><th>Marcador</th></tr>
            ${sanRows}
          </table>
        </div>

        <div class="footer-col">
          <div class="footer-title">Observaciones del Partido</div>
          <div class="obs-content">
            ${partido.observaciones || 'Sin observaciones registradas.'}
          </div>
          <div class="footer-title">Aprobación y Firmas Oficiales</div>
          <div class="firmas-grid">
            <div class="firma-box">
              <div class="firma-label">1° Árbitro Principal</div>
              ${partido.arbitraje?.[0]?.nombre || ''}
            </div>
            <div class="firma-box">
              <div class="firma-label">2° Árbitro Asistente</div>
              ${partido.arbitraje?.[1]?.nombre || ''}
            </div>
            <div class="firma-box">
              <div class="firma-label">Anotador Oficial</div>
              ${partido.anotador || ''}
            </div>
            <div class="firma-box">
              <div class="firma-label">Asistente Anotador</div>
              ${partido.asistente_anotador || ''}
            </div>
            <div class="firma-box">
              <div class="firma-label">Capitán Equipo A</div>
              ${eqA.capitan || ''}
            </div>
            <div class="firma-box">
              <div class="firma-label">Capitán Equipo B</div>
              ${eqB.capitan || ''}
            </div>
          </div>
        </div>

        <div class="footer-col">
          <div class="footer-title">Resultados y Estadísticas</div>
          <table class="std-table">
            <tr>
              <th rowspan="2">Set</th>
              <th rowspan="2">Dur<br>(min)</th>
              <th colspan="2">Puntos</th>
              <th colspan="2">Subs</th>
              <th colspan="2">T.O.</th>
              <th colspan="2">Ganador</th>
            </tr>
            <tr>
              <th>A</th><th>B</th>
              <th>A</th><th>B</th>
              <th>A</th><th>B</th>
              <th>A</th><th>B</th>
            </tr>
            ${resRows}
          </table>
          <div class="ganador-box">
            <div style="font-size: 6px; color: #666; margin-bottom: 3px;">🏆 GANADOR DEL PARTIDO</div>
            <div class="ganador-team">${ganadorNombre}</div>
            <div class="ganador-score">${wA} - ${wB}</div>
            <div style="font-size: 6px; color: #666; margin-top: 3px;">
              ${partido.estado_partido.estado === 'finalizado' ? 'Partido Finalizado' : 'En Progreso'}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

module.exports = new PlanillaGeneradorService();
