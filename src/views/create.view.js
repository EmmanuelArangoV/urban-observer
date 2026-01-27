export function renderCreateProject() {
    const app = document.getElementById('app');

    app.innerHTML = `
    <style>
      @keyframes spin {
        from { transform: translateY(-50%) rotate(0deg); }
        to { transform: translateY(-50%) rotate(360deg); }
      }
      
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .search-section {
        padding: 2rem 0;
        min-height: calc(100vh - 200px);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .back-button {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: white;
        color: #374151;
        text-decoration: none;
        border-radius: 0.5rem;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .back-button:hover {
        background: #f9fafb;
        transform: translateX(-4px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .back-icon {
        width: 20px;
        height: 20px;
      }

      #create-project-form input,
      #create-project-form select,
      #create-project-form textarea {
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      #create-project-form input:focus,
      #create-project-form select:focus,
      #create-project-form textarea:focus {
        outline: none;
        border-color: #2563eb !important;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
      }

      #create-project-form input[readonly] {
        cursor: not-allowed;
      }

      #cancel-btn:hover {
        background: #f9fafb !important;
        border-color: #9ca3af !important;
      }

      #submit-btn {
        transition: all 0.3s ease;
      }

      #submit-btn:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }

      #submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      #city-results::-webkit-scrollbar {
        width: 8px;
      }

      #city-results::-webkit-scrollbar-track {
        background: #f3f4f6;
        border-radius: 4px;
      }

      #city-results::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 4px;
      }

      #city-results::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }

      #form-error,
      #form-success {
        animation: slideDown 0.3s ease;
      }

      @media (max-width: 768px) {
        .search-section {
          padding: 1rem 0;
        }

        .search-section .container {
          padding: 0 0.5rem !important;
        }

        .back-button {
          font-size: 0.875rem;
          padding: 0.5rem 0.75rem;
        }

        #create-project-form > div[style*="grid"] {
          grid-template-columns: 1fr !important;
        }
      }
    </style>

     <!-- Header -->
    <main>
      <section class="search-section">
        <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 1rem;">
          <a href="#/" class="back-button" style="margin-bottom: 1.5rem;">
            <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Volver al listado
          </a>

          <div style="background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 2rem; max-width: 600px; margin: 0 auto;">
            <h1 style="font-size: 1.5rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">
              Crear Nuevo Proyecto
            </h1><p style="color: #6b7280; margin-bottom: 2rem;">
              Registra un nuevo proyecto de monitoreo climático y ambiental
            </p>
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #e5e7eb;">
              <h3 style="font-size: 0.875rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">
                 Cómo usar el buscador
              </h3>
              <p style="font-size: 0.75rem; color: #6b7280; line-height: 1.5;">
                Escribe el nombre de una ciudad en el buscador y selecciona una de las opciones. 
                Las coordenadas se autocompletarán automáticamente usando la Geocoding API de Open-Meteo.
              </p>
            </div>

            <form id="create-project-form">
              <div style="margin-bottom: 1.5rem; padding-top: 2rem">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  🔍 Buscar ciudad en Open-Meteo
                </label>
                <div style="position: relative;">
                  <input 
                    type="text" 
                    id="city-search-input" 
                    placeholder="Ej: Madrid, París, Nueva York..."
                    style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem;"
                  />
                  <div id="city-search-loader" style="display: none; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; border: 2px solid #e5e7eb; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
                <div id="city-results" style="display: none; margin-top: 0.5rem; background: white; border: 1px solid #e5e7eb; border-radius: 0.375rem; max-height: 300px; overflow-y: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></div>
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  Nombre del Proyecto <span style="color: #ef4444;">*</span>
                </label>
                <input 
                  type="text" 
                  id="name-input" 
                  name="name"
                  placeholder="Ej: Monitoreo Ambiental Bogotá"
                  required
                  style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem;"
                />
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  Ciudad <span style="color: #ef4444;">*</span>
                </label>
                <input 
                  type="text" 
                  id="city-input" 
                  name="city"
                  placeholder="Ej: Bogotá"
                  required
                  readonly
                  style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background: #f9fafb;"
                />
                <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">
                  Se autocompletará al seleccionar una ciudad del buscador
                </p>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                  <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                    Latitud <span style="color: #ef4444;">*</span>
                  </label>
                  <input 
                    type="number" 
                    id="lat-input" 
                    name="lat"
                    placeholder="4.7110"
                    step="0.0001"
                    required
                    readonly
                    style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background: #f9fafb;"
                  />
                </div>
                <div>
                  <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                    Longitud <span style="color: #ef4444;">*</span>
                  </label>
                  <input 
                    type="number" 
                    id="lon-input" 
                    name="lon"
                    placeholder="-74.0721"
                    step="0.0001"
                    required
                    readonly
                    style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background: #f9fafb;"
                  />
                </div>
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  Descripción <span style="color: #ef4444;">*</span>
                </label>
                <textarea 
                  id="description-input" 
                  name="description"
                  placeholder="Describe el objetivo y alcance del proyecto..."
                  required
                  rows="4"
                  style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; resize: vertical;"
                ></textarea>
              </div>

              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
                  Estado <span style="color: #ef4444;">*</span>
                </label>
                <select 
                  id="status-input" 
                  name="status"
                  required
                  style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background: white;"
                >
                  <option value="">Selecciona un estado</option>
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>

              <div id="form-error" style="display: none; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; margin-bottom: 1rem;"></div>

              <div id="form-success" style="display: none; background: #f0fdf4; border: 1px solid #86efac; color: #16a34a; padding: 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; margin-bottom: 1rem;"></div>

              <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button 
                  type="button" 
                  id="cancel-btn"
                  style="padding: 0.75rem 1.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white; color: #374151; font-weight: 500; cursor: pointer;"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  id="submit-btn"
                  style="padding: 0.75rem 1.5rem; border: none; border-radius: 0.375rem; background: linear-gradient(to right, #2563eb, #14b8a6); color: white; font-weight: 500; cursor: pointer;"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
    <!-- Footer -->
  `;
    /*
    initHeaderEvents(() => {
        authService.logout();
        router.navigate('/login');
    });

    initCreateFormEvents();
    initCitySearchEvents();
    */
}
