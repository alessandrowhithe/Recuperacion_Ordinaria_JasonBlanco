// services/api.js - Solo Retool (Sin datos mock)

// Configuración para Retool
const RETOOL_CONFIG = {
  baseURL: import.meta.env.VITE_RETOOL_API_BASE_URL || '',
  token: import.meta.env.VITE_RETOOL_API_TOKEN || '',
  timeout: 10000,
};


/* aqui te dejo como es la base en retool
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  course VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

*/  

// Verificar configuración
if (!RETOOL_CONFIG.baseURL || !RETOOL_CONFIG.token) {
  console.warn('⚠️ Configuración de Retool incompleta. Verifica tu archivo .env');
  console.warn('Variables necesarias:');
  console.warn('- VITE_RETOOL_API_BASE_URL');
  console.warn('- VITE_RETOOL_API_TOKEN');
}

class RetoolAPI {
  constructor() {
    this.baseURL = RETOOL_CONFIG.baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RETOOL_CONFIG.token}`,
      'Accept': 'application/json',
    };
  }

  async makeRequest(endpoint, options = {}) {
    try {
      if (!this.baseURL || !RETOOL_CONFIG.token) {
        throw new Error('API no configurada. Verifica las variables de entorno.');
      }

      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.headers,
        mode: 'cors',
        ...options,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), RETOOL_CONFIG.timeout);
      config.signal = controller.signal;

      console.log(`🚀 [Retool API] ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorText = await response.text();
          errorMessage += `: ${errorText}`;
        } catch {
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ [Retool API] Response:`, data);
      
      return {
        success: true,
        data: data,
        message: 'Operación exitosa',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ [Retool API] Error:`, error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          data: null,
          message: 'Timeout: La petición tardó demasiado tiempo'
        };
      }

      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Error de conexión. Verifica que Retool esté configurado y accesible.';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Error CORS. Configura los orígenes permitidos en Retool.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Error de autenticación. Verifica tu token de API.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Endpoint no encontrado. Verifica la URL de tu API.';
      }

      return {
        success: false,
        data: null,
        message: errorMessage,
        error: error.name
      };
    }
  }

  delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

  async getAllStudents() {
    await this.delay();
    
    const response = await this.makeRequest('/students', {
      method: 'GET'
    });

    if (response.success && response.data) {
      let students = response.data;
      
      if (response.data.data && Array.isArray(response.data.data)) {
        students = response.data.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        students = response.data.results;
      } else if (!Array.isArray(students)) {
        students = [];
      }

      students = students.map(student => ({
        ...student,
        id: parseInt(student.id) || student.id,
        age: parseInt(student.age) || 0,
        name: student.name || '',
        email: student.email || '',
        course: student.course || '',
        status: student.status || 'active'
      }));

      response.data = students;
    }

    return response;
  }

  async getStudentById(id) {
    await this.delay();
    
    const response = await this.makeRequest(`/students/${id}`, {
      method: 'GET'
    });

    if (response.success && response.data) {
      response.data = {
        ...response.data,
        id: parseInt(response.data.id) || response.data.id,
        age: parseInt(response.data.age) || 0,
        name: response.data.name || '',
        email: response.data.email || '',
        course: response.data.course || '',
        status: response.data.status || 'active'
      };
    }

    return response;
  }

  async createStudent(studentData) {
    await this.delay();
    
    const validationResult = this.validateStudentData(studentData);
    if (!validationResult.isValid) {
      return {
        success: false,
        data: null,
        message: validationResult.error
      };
    }

    const payload = {
      name: studentData.name.trim(),
      email: studentData.email.toLowerCase().trim(),
      age: parseInt(studentData.age),
      course: studentData.course.trim(),
      status: studentData.status || 'active'
    };

    console.log('📤 [Retool API] Creating student:', payload);

    return await this.makeRequest('/students', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async updateStudent(id, studentData) {
    await this.delay();
    
    const validationResult = this.validateStudentData(studentData);
    if (!validationResult.isValid) {
      return {
        success: false,
        data: null,
        message: validationResult.error
      };
    }

    const payload = {
      name: studentData.name.trim(),
      email: studentData.email.toLowerCase().trim(),
      age: parseInt(studentData.age),
      course: studentData.course.trim(),
      status: studentData.status
    };

    console.log(`📤 [Retool API] Updating student ${id}:`, payload);

    return await this.makeRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  async deleteStudent(id) {
    await this.delay();
    
    console.log(`🗑️ [Retool API] Deleting student ${id}`);
    
    return await this.makeRequest(`/students/${id}`, {
      method: 'DELETE'
    });
  }

  async getStats() {
    await this.delay();
    
    try {
      // Opción 1: Si Retool tiene endpoint específico para stats
      // const response = await this.makeRequest('/students/stats', { method: 'GET' });
      // if (response.success) return response;
      
      // Opción 2: Calcular desde todos los estudiantes
      const studentsResponse = await this.getAllStudents();
      
      if (!studentsResponse.success) {
        return studentsResponse;
      }

      const students = studentsResponse.data || [];
      const total = students.length;
      const active = students.filter(s => s.status === 'active').length;
      const inactive = students.filter(s => s.status === 'inactive').length;
      const avgAge = total > 0 ? Math.round(students.reduce((sum, s) => sum + (s.age || 0), 0) / total) : 0;

      console.log('📊 [Retool API] Calculated stats:', { total, active, inactive, avgAge });

      return {
        success: true,
        data: { total, active, inactive, avgAge },
        message: 'Estadísticas calculadas exitosamente'
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        success: false,
        data: { total: 0, active: 0, inactive: 0, avgAge: 0 },
        message: 'Error calculando estadísticas'
      };
    }
  }

  // Validar datos de estudiante
  validateStudentData(studentData) {
    if (!studentData.name || studentData.name.trim().length < 2) {
      return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
    }

    if (!studentData.email || !this.isValidEmail(studentData.email)) {
      return { isValid: false, error: 'El email no tiene un formato válido' };
    }

    if (!studentData.age || studentData.age < 1 || studentData.age > 200) {
      return { isValid: false, error: 'La edad debe estar entre 1 y 200 años' };
    }

    if (!studentData.course || studentData.course.trim().length < 2) {
      return { isValid: false, error: 'El curso debe tener al menos 2 caracteres' };
    }

    if (!['active', 'inactive'].includes(studentData.status)) {
      return { isValid: false, error: 'El estado debe ser "active" o "inactive"' };
    }

    return { isValid: true };
  }

  // Validar formato de email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Test de conexión
  async testConnection() {
    try {
      console.log('🔗 [Retool API] Testing connection...');
      
      const response = await this.makeRequest('/students?limit=1', {
        method: 'GET'
      });
      
      if (response.success) {
        console.log('✅ [Retool API] Connection test successful');
        return true;
      } else {
        console.log('❌ [Retool API] Connection test failed:', response.message);
        return false;
      }
    } catch (error) {
      console.error('❌ [Retool API] Connection test error:', error);
      return false;
    }
  }

  // Información de configuración (para debugging)
  getConfig() {
    return {
      baseURL: this.baseURL,
      hasToken: !!RETOOL_CONFIG.token,
      tokenLength: RETOOL_CONFIG.token ? RETOOL_CONFIG.token.length : 0
    };
  }
}

// Instancia única de la API
const API = new RetoolAPI();

// Test de conexión y configuración al inicializar
if (import.meta.env.DEV) {
  console.log('🔧 [Retool API] Configuration:', API.getConfig());
  
  API.testConnection().then(connected => {
    if (connected) {
      console.log('✅ [Retool API] Conectado exitosamente');
    } else {
      console.log('❌ [Retool API] Error de conexión');
      console.log('💡 Verifica:');
      console.log('   1. Archivo .env con variables correctas');
      console.log('   2. Configuración CORS en Retool');
      console.log('   3. URL y token de API válidos');
    }
  });
}

export default API;