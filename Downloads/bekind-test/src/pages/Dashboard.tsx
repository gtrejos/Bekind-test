import { useEffect, useState } from 'react'
import { getActions, deleteAction } from '../api/actions'
import type { Action } from '../types'
import { CreateActionModal } from '../components/CreateActionModal';
import { useNavigate } from 'react-router-dom'
import { Trash2, PencilLine, Image as ImageIcon, Search, Filter, Home, TrendingUp, Users, DollarSign, ShoppingBag, Award, FileText, Eye, LogOut, List } from 'lucide-react'
import '../styles/Dashboard.css';
import '../styles/ConfirmDialog.css';

export const Dashboard = () => {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalItems, setTotalItems] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('categorias');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate()

  const getImageUrl = (action: any) => {
    const url = action.icon || action.imageUrl;
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `https://dev.api.bekindnetwork.com/${url.replace(/^\//, '')}`;
  }

  const fetchActions = async (pageNum: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await getActions(pageNum, 10)
      
      console.log("🔎 Respuesta cruda:", response);

      const innerData = response.data;

      let items: Action[] = [];
      let total = 0;
      let pages = 0;

      if (innerData && innerData.data) {
        items = innerData.data;
        total = innerData.totalElements || 0;
        pages = innerData.totalPages || 0;
      }

      setActions(items)
      setTotalItems(total)
      setTotalPages(pages)
      
    } catch (err: any) {
      console.error("Error cargando acciones:", err);
      if (err.response && err.response.status === 401) {
        navigate('/') 
        return
      }
      setError('Error al cargar las acciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActions(page)
  }, [page])

  const handleCreate = () => {
    setIsModalOpen(true);
  }

  const handleEdit = (actionId: string) => {
    navigate(`/editar-accion/${actionId}`)
  }

  const handleDeleteClick = (actionId: string, actionName: string) => {
    setActionToDelete({ id: actionId, name: actionName });
    setDeleteModalOpen(true);
  }

  const confirmDelete = async () => {
    if (!actionToDelete) return;
    
    try {
      await deleteAction(actionToDelete.id);
      fetchActions(page);
      setDeleteModalOpen(false);
      setActionToDelete(null);
    } catch (err) {
      setError('Error al eliminar la acción');
      setDeleteModalOpen(false);
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setActionToDelete(null);
  }

  const handleLogout = () => {
    // Limpiar el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir al login
    navigate('/');
  }


  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Invalid Date') {
      const now = new Date();
      return now.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    try {
      const date = new Date(dateString);
      
    
      if (isNaN(date.getTime())) {

        const now = new Date();
        return now.toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {

      const now = new Date();
      return now.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo-section">
          <img src="/bekind2.png" alt="Be Kind Network" className="sidebar-logo" />
        </div>
        
        <nav className="sidebar-menu">
          <button className="sidebar-menu-item">
            <Home className="sidebar-menu-icon" />
            Home
          </button>
          <button className="sidebar-menu-item">
            <TrendingUp className="sidebar-menu-icon" />
            Impacto Social
          </button>
          <button className="sidebar-menu-item">
            <Users className="sidebar-menu-icon" />
            Comunidad
          </button>
          <button className="sidebar-menu-item">
            <DollarSign className="sidebar-menu-icon" />
            Sponsors
          </button>
          <button className="sidebar-menu-item">
            <ShoppingBag className="sidebar-menu-icon" />
            Marketplace
          </button>
          <button className="sidebar-menu-item active">
            <Award className="sidebar-menu-icon" />
            Bakanes
          </button>
          <button className="sidebar-menu-item">
            <FileText className="sidebar-menu-icon" />
            Contenidos
          </button>
          <button className="sidebar-menu-item">
            <List className="sidebar-menu-icon" />
            Categorías de acciones
          </button>
        </nav>

        {/* Logout button in sidebar */}
        <div style={{ marginTop: 'auto', padding: '16px' }}>
          <button 
            className="sidebar-menu-item" 
            onClick={handleLogout}
            style={{ 
              color: '#ef4444',
              width: '100%'
            }}
          >
            <LogOut className="sidebar-menu-icon" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar - 1440x65px con logo3.png */}
        <header className="dashboard-topbar">
          <img src="/logo3.png" alt="Be Kind Network" className="topbar-logo" />
          <div style={{ position: 'relative' }}>
            <button 
              className="user-profile-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              A
            </button>
            
            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                minWidth: '200px',
                zIndex: 50,
                overflow: 'hidden'
              }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#ef4444',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="dashboard-content">
          <div className="dashboard-content-inner">
            {/* Header */}
            <div className="dashboard-header">
              <h1 className="dashboard-title">Categorías</h1>
              
              {/* Tabs */}
              <div className="dashboard-tabs">
                <button 
                  className={`dashboard-tab ${activeTab === 'categorias' ? 'active' : ''}`}
                  onClick={() => setActiveTab('categorias')}
                >
                  Categorías
                </button>
                <button 
                  className={`dashboard-tab ${activeTab === 'tipos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tipos')}
                >
                  Tipos
                </button>
                <button 
                  className={`dashboard-tab ${activeTab === 'evidencias' ? 'active' : ''}`}
                  onClick={() => setActiveTab('evidencias')}
                >
                  Evidencias
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="dashboard-controls">
              <div className="controls-left">
                <div className="search-input-wrapper">
                  <Search className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Buscar" 
                    className="search-input"
                  />
                </div>
                <button className="filter-button">
                  <Filter size={16} />
                  Filtros
                </button>
              </div>
              <button className="create-button" onClick={handleCreate}>
                Crear tipo de categoría
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>Cargando acciones...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="error-container">
                <p className="error-text">{error}</p>
                <button className="retry-button" onClick={() => fetchActions(page)}>
                  Reintentar
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && actions.length === 0 && (
              <div className="empty-state">
                <ImageIcon className="empty-state-icon" />
                <h3 className="empty-state-title">No hay acciones disponibles</h3>
                <p className="empty-state-text">Usa el botón superior para crear la primera acción.</p>
              </div>
            )}

            {/* Table with Data */}
            {!loading && !error && actions.length > 0 && (
              <div className="dashboard-table-container">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Nombre de la categoría</th>
                      <th>Icono de la categoría</th>
                      <th>Estado</th>
                      <th>Descripción</th>
                      <th>Fecha de creación</th>
                      <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actions.map((action) => (
                      <tr key={action.id}>
                        <td>
                          <span style={{ fontWeight: 500 }}>{action.name}</span>
                        </td>
                        
                        <td className="icon-cell">
                          {getImageUrl(action) ? (
                            <div className="action-icon-wrapper">
                              <img
                                src={getImageUrl(action)!}
                                alt={action.name}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="action-icon-placeholder">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </td>

                        <td>
                          <span className="status-badge active">
                            Activo
                          </span>
                        </td>

                        <td>
                          <span title={action.description}>
                            {action.description}
                          </span>
                        </td>

                        <td style={{ color: '#6b7280' }}>
                          {formatDate(action.creationDate)}
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button 
                              onClick={() => handleEdit(action.id.toString())} 
                              className="action-btn edit"
                              title="Editar"
                            >
                              <PencilLine size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(action.id.toString(), action.name)} 
                              className="action-btn delete"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button 
                              className="action-btn view"
                              title="Ver"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination-container">
                  <div className="pagination-info">
                    <span>Resultados por página</span>
                    <select className="pagination-select" defaultValue="10">
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                    <span style={{ marginLeft: '16px' }}>
                      {(page - 1) * 10 + 1} - {Math.min(page * 10, totalItems)} de {totalItems}
                    </span>
                  </div>
                  
                  <div className="pagination-controls">
                    <div className="pagination-buttons">
                      <button 
                        className="pagination-btn"
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        title="Primera página"
                      >
                        «
                      </button>
                      <button 
                        className="pagination-btn"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        title="Página anterior"
                      >
                        ‹
                      </button>
                      <button 
                        className="pagination-btn"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= totalPages}
                        title="Página siguiente"
                      >
                        ›
                      </button>
                      <button 
                        className="pagination-btn"
                        onClick={() => setPage(totalPages)}
                        disabled={page >= totalPages}
                        title="Última página"
                      >
                        »
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL CREATE */}
      <CreateActionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setPage(1);
          fetchActions(1);
        }} 
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && actionToDelete && (
        <div className="confirm-dialog-overlay" onClick={cancelDelete}>
          <div className="confirm-dialog-container" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-header">
              <div className="confirm-dialog-icon">
                <Trash2 />
              </div>
              <div className="confirm-dialog-header-text">
                <h3 className="confirm-dialog-title">¿Eliminar categoría?</h3>
                <p className="confirm-dialog-message">
                  ¿Estás seguro de eliminar la categoría{' '}
                  <span className="confirm-dialog-item-name">"{actionToDelete.name}"</span>?
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="confirm-dialog-footer">
              <button 
                className="confirm-dialog-button confirm-dialog-button-cancel"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
              <button 
                className="confirm-dialog-button confirm-dialog-button-delete"
                onClick={confirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}