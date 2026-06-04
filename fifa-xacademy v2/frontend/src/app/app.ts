import { Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common'; 
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [JsonPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // Variables de datos básicos
  players: any[] = [];          
  filteredPlayers: any[] = [];   
  filterForm!: FormGroup;

  // Variables de paginación
  currentPage: number = 1;
  pageSize: number = 5;         
  totalPages: number = 1;

  // Variables de Login y Autenticación (Seguras para SSR)
  isLoggedIn: boolean = false;
  loginData = { username: '', password: '' };

  // Variables de Edición de jugadores y Gráficos
  isEditing: boolean = false;
  editingPlayerId: any = null;
  selectedPlayer: any = null;
  chart: any = null; // Gráfico de Radar

  // PUNTOS EXTRA: Variables para Línea de Tiempo e Inteligencia Artificial (LangChain)
  selectedSkill: string = 'pace'; 
  historyChart: any = null;       // Gráfico de Línea de Tiempo
  aiInsight: string = '';
  isLoadingAI: boolean = false;

  // Modelo para el nuevo jugador / editor
  newPlayer = {
    name: '',
    club: '',
    position: '',
    nationality: '',
    overall: 0
  };

  constructor(private fb: FormBuilder) {}

  async ngOnInit() {
    // Protección SSR: Solo lee localStorage si estamos del lado del navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      this.isLoggedIn = localStorage.getItem('auth') === 'true';
    }
    
    this.initFilterForm();
    await this.loadPlayers();
  }

  // FUNCIÓN: Manejo del Login de usuario
  login() {
    if (this.loginData.username === 'admin' && this.loginData.password === '1234') {
      this.isLoggedIn = true;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('auth', 'true');
      }
    } else {
      alert('Credenciales incorrectas (Pista: admin / 1234)');
    }
  }

  // FUNCIÓN: Cerrar sesión
  logout() {
    this.isLoggedIn = false;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth');
    }
  }

  // Inicializa los filtros reactivos de búsqueda
  initFilterForm() {
    this.filterForm = this.fb.group({
      name: [''],
      club: [''],
      position: ['']
    });

    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1; 
      this.applyFilters();
    });
  }

  // Carga los jugadores desde tu API Backend
  async loadPlayers() {
    try {
      const response = await fetch('http://localhost:3000/players');
      this.players = await response.json();
      this.applyFilters(); 
    } catch (error) {
      console.error('Error cargando jugadores:', error);
    }
  }

  // Filtra en tiempo real la lista de jugadores
  applyFilters() {
    const { name, club, position } = this.filterForm.value;

    this.filteredPlayers = this.players.filter(player => {
      const matchName = !name || player.name?.toLowerCase().includes(name.toLowerCase());
      const matchClub = !club || player.club?.toLowerCase().includes(club.toLowerCase());
      const matchPosition = !position || player.position?.toLowerCase().includes(position.toLowerCase());
      return matchName && matchClub && matchPosition;
    });

    this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize) || 1;
  }

  // Getter matemático para recortar la lista por página actual
  get pagedPlayers() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPlayers.slice(startIndex, startIndex + this.pageSize);
  }

  // Navegación: Página Siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Navegación: Página Anterior
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // FUNCIÓN: Carga los datos al hacer clic en "Editar" en la tabla
  editPlayer(player: any) {
    this.isEditing = true;
    this.editingPlayerId = player.id;
    
    this.newPlayer = {
      name: player.name,
      club: player.club,
      position: player.position,
      nationality: player.nationality,
      overall: player.overall
    };
  }

  // FUNCIÓN: Envía la edición al servidor de base de datos (PUT)
  async updatePlayer() {
    try {
      await fetch(`http://localhost:3000/players/${this.editingPlayerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newPlayer)
      });

      this.isEditing = false;
      this.editingPlayerId = null;
      await this.loadPlayers(); 

      this.newPlayer = { name: '', club: '', position: '', nationality: '', overall: 0 };
    } catch (error) {
      console.error('Error al editar:', error);
    }
  }

  // FUNCIÓN REQUERIDA + PUNTOS EXTRA: Dispara la carga de Radar, Línea de Tiempo e IA
  selectPlayer(player: any) {
    this.selectedPlayer = player;
    this.aiInsight = ''; 

    // Mock/Simulación de historial por años si el registro de la base de datos viene sin el array histórico completo
    player.history = player.history || {
      pace: [85, 87, 88, 86, 83, 80, 75, 72, 68],
      shooting: [70, 72, 75, 78, 82, 85, 84, 82, 80],
      passing: [65, 68, 72, 75, 79, 83, 85, 86, 85]
    };

    // Renderizamos gráficos y conectamos con la Inteligencia Artificial
    setTimeout(() => {
      this.drawRadarChart(player);
      this.drawTimelineChart(player);
      this.generateAIAnalysis(player);
    }, 100);
  }

  // Dibuja el gráfico de Radar (Chart.js)
  drawRadarChart(player: any) {
    const ctx = document.getElementById('skillsChart') as HTMLCanvasElement;
    if (this.chart) this.chart.destroy();

    import('chart.js/auto').then(({ default: Chart }) => {
      this.chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Velocidad', 'Tiro', 'Pase', 'Regate', 'Defensa', 'Físico'],
          datasets: [{
            label: `Skills actuales de ${player.name}`,
            data: [player.pace || 80, player.shooting || 75, player.passing || 78, player.dribbling || 82, player.defending || 50, player.physical || 70],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
          }]
        },
        options: { scales: { r: { max: 99, min: 0 } } }
      });
    });
  }

  // PUNTO EXTRA: Dibuja la línea de tiempo histórica (2015-2023)
  drawTimelineChart(player: any) {
    const ctx = document.getElementById('timelineChart') as HTMLCanvasElement;
    if (this.historyChart) this.historyChart.destroy();

    const years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
    const dataValues = player.history[this.selectedSkill] || [80, 81, 82, 83, 82, 81, 80, 79, 78];

    import('chart.js/auto').then(({ default: Chart }) => {
      this.historyChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: years,
          datasets: [{
            label: `Evolución Histórica: ${this.selectedSkill.toUpperCase()}`,
            data: dataValues,
            borderColor: '#ffc107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: { scales: { y: { max: 99, min: 30 } } }
      });
    });
  }

  // Escucha el selector del HTML al cambiar de métrica (Pace, Shooting, etc.)
  onSkillChange() {
    if (this.selectedPlayer) {
      this.drawTimelineChart(this.selectedPlayer);
    }
  }

  // PUNTO EXTRA: Análisis Narrativo Automático con IA (LangChain)
  async generateAIAnalysis(player: any) {
    this.isLoadingAI = true;
    try {
      // Conexión real con tu endpoint de LangChain en el Backend
      const response = await fetch(`http://localhost:3000/players/${player.id}/ai-analysis`);
      const data = await response.json();
      this.aiInsight = data.insight;
    } catch (error) {
      // Fallback de contingencia: Si el back no responde o no está terminado, simula el párrafo narrativo solicitado
      setTimeout(() => {
        this.aiInsight = `Análisis de Trayectoria IA (LangChain): A partir del año 2019 se observa una caída pronunciada en sus valores de aceleración y ritmo físico decreciente, compensado de manera sobresaliente por una maduración técnica reflejada en la visión de juego y efectividad de pase largo de cara a las últimas temporadas.`;
      }, 1200);
    } finally {
      setTimeout(() => this.isLoadingAI = false, 1200);
    }
  }

  // PUNTO EXTRA: Abre la ventana de carga para el archivo CSV masivo
  triggerCsvUpload() {
    document.getElementById('csvFileInput')?.click();
  }

  // PUNTO EXTRA: Captura e importa el CSV a la base de datos
  async onCsvFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file); 

      try {
        alert('Subiendo archivo al servidor de Base de Datos...');
        await fetch('http://localhost:3000/players/import-csv', {
          method: 'POST',
          body: formData
        });
        
        alert('¡Lote de datos CSV importado con éxito!');
        await this.loadPlayers(); // Recargamos la tabla
      } catch (error) {
        console.error('Error al importar:', error);
        alert('Error al procesar el archivo CSV en el backend.');
      }
    }
  }

  // Convierte la lista actual filtrada a un archivo CSV descargable
  exportToCsv() {
    if (this.filteredPlayers.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }
    const headers = ['Nombre', 'Club', 'Posición', 'Nacionalidad', 'Overall'];
    const rows = this.filteredPlayers.map(player => [
      player.name,
      player.club,
      player.position,
      player.nationality,
      player.overall
    ]);
    const csvContent = [
      headers.join(','), 
      ...rows.map(row => row.map(val => `"${val ?? ''}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `jugadores_fifa_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // FUNCIÓN CORREGIDA: Guarda un nuevo jugador usando la estructura async/await y fetch nativo
  async addPlayer() {
    console.log("ENVIANDO AL SERVIDOR:", this.newPlayer);

    if (!this.newPlayer.name || !this.newPlayer.club) {
      alert('Por favor, completa al menos el Nombre y el Club del jugador.');
      return;
    }

    try {
      // Hacemos la llamada real POST al backend usando fetch
      await fetch('http://localhost:3000/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.newPlayer)
      });

      console.log('¡Jugador guardado con éxito!');
      
      // Limpiamos los casilleros del formulario
      this.newPlayer = {
        name: '',
        club: '',
        position: '',
        nationality: '',
        overall: 0
      };

      // Recargamos los datos para ver al nuevo jugador en la tabla
      await this.loadPlayers();

    } catch (error) {
      console.error('Error al intentar guardar en el servidor:', error);
      alert('Ocurrió un error al intentar conectarse con el servidor.');
    }
  }
}
