import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { createAction } from '../api/actions';
import '../styles/CreateActionModal.css';

const createActionSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres').max(200, 'Máximo 200 caracteres'),
  icon: z.any().optional(), 
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Código HEX inválido').optional(),
  isActive: z.boolean(),
  creationDate: z.string().optional(), 
});

type CreateActionFormData = z.infer<typeof createActionSchema>;

interface CreateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateActionModal = ({ isOpen, onClose, onSuccess }: CreateActionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const getCurrentDate = () => {
    return new Date().toISOString();
  };

  const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm<CreateActionFormData>({
    resolver: zodResolver(createActionSchema),
    defaultValues: {
      isActive: true,
      color: '#000000',
      creationDate: getCurrentDate() 
    }
  });

  const selectedColor = watch('color');
  const isActive = watch('isActive');

  const onSubmit = async (data: CreateActionFormData) => {
    setIsSubmitting(true);
    setGlobalError(null);
    
    if (!data.icon || !data.icon[0]) {
      setGlobalError('El icono es obligatorio');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description); 
      formData.append('status', data.isActive ? '1' : '0');
      formData.append('color', data.color || '#000000');
      formData.append('icon', data.icon[0]);
      
      
      formData.append('creationDate', data.creationDate || getCurrentDate());
      
      await createAction(formData);
      
      reset({
        isActive: true,
        color: '#000000',
        creationDate: getCurrentDate() 
      });
      setCharCount(0);
      onSuccess();
      onClose();
      
    } catch (err: any) {
      console.error(err);
      const serverMessage = err.response?.data?.message || err.message;
      setGlobalError(`Error: ${serverMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Crear categoría</h2>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {globalError && (
            <div className="global-error">
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} id="create-action-form">
            {/* Nombre */}
            <div className="form-group">
              <label className="form-label form-label-required">
                Nombre de la categoría
              </label>
              <input
                type="text"
                {...register('name')}
                className="form-input"
                placeholder="Escribe el nombre de la buena acción"
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="form-group">
              <div className="textarea-header">
                <label className="form-label form-label-required">
                  Descripción de la buena acción
                </label>
                <span className="char-count">{charCount}/200</span>
              </div>
              <textarea
                {...register('description')}
                className="form-textarea"
                placeholder="Agregar descripción"
                onChange={(e) => {
                  setCharCount(e.target.value.length);
                  register('description').onChange(e);
                }}
              />
              {errors.description && (
                <p className="error-message">{errors.description.message}</p>
              )}
            </div>

            {/* Logo */}
            <div className="form-group">
              <label className="form-label form-label-required">Logo</label>
              <label className="file-upload-wrapper">
                <span className="file-upload-text">Carga archivo</span>
                <Upload size={20} className="file-upload-icon" />
                <input
                  type="file"
                  {...register('icon')}
                  className="file-upload-input"
                  accept="image/*"
                />
              </label>
            </div>

            {/* Color */}
            <div className="form-group">
              <label className="form-label form-label-required">Color</label>
              <div className="color-input-wrapper">
                <div
                  className="color-preview"
                  style={{ backgroundColor: selectedColor || '#000000' }}
                />
                <input
                  type="text"
                  {...register('color')}
                  className="color-input"
                  placeholder="Registra color código HEX"
                />
              </div>
              {errors.color && (
                <p className="error-message">{errors.color.message}</p>
              )}
            </div>

            {/* Toggle Activo */}
            <div className="form-group">
              <div className="toggle-wrapper">
                <div
                  className={`toggle-switch ${isActive ? 'active' : ''}`}
                  onClick={() => setValue('isActive', !isActive)}
                >
                  <div className="toggle-slider" />
                </div>
                <label className="toggle-label">Activo</label>
                <input
                  type="checkbox"
                  {...register('isActive')}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Campo oculto para creationDate */}
            <input type="hidden" {...register('creationDate')} />
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="modal-button modal-button-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="create-action-form"
            className="modal-button modal-button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
};