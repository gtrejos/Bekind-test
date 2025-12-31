import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAction } from '../api/actions';
import Button from '../components/Button'; 

const createActionSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres').max(200, 'Máximo 200 caracteres'),
  logo: z.any().optional(), 
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Código HEX inválido').optional(),
  isActive: z.boolean(), 
});

type CreateActionFormData = z.infer<typeof createActionSchema>;

export const CreateAction = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateActionFormData>({
    resolver: zodResolver(createActionSchema),
    defaultValues: {
      isActive: true,
      color: '#000000'
    }
  });

  const selectedColor = watch('color');

  const onSubmit = async (data: CreateActionFormData) => {
    setIsSubmitting(true);
    setGlobalError(null);
    
    try {
     
      const formData = new FormData();
      
      
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('status', data.isActive ? 'true' : 'false');
      formData.append('color', data.color || '#000000');

    
      if (data.logo && data.logo[0]) {
        formData.append('logo', data.logo[0]); 
      }
      
  
      await createAction(formData);
      navigate('/dashboard');
      
    } catch (err: any) {
    
      console.error("Error completo:", err);
      const serverMessage = err.response?.data?.message || err.response?.data?.title || err.message;
      console.error("Mensaje del servidor:", serverMessage);
      
      setGlobalError(`Error: ${serverMessage || 'Error desconocido al crear la acción.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nueva Categoría</h2>
      
      {globalError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* --- Nombre --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de la categoría *</label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Escribe el nombre de la buena acción"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* --- Descripción --- */}
        <div>
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-gray-700">Descripción *</label>
            <span className="text-xs text-gray-500">0/200</span>
          </div>
          <textarea
            rows={4}
            {...register('description')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Agregar descripción"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        {/* --- Logo (Archivo) --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo *</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>Carga archivo</span>
                  <input id="logo-upload" type="file" {...register('logo')} className="sr-only" accept="image/*" />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
            </div>
          </div>
        </div>

        {/* --- Color (HEX) --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Color *</label>
          <div className="flex items-center space-x-3 mt-1">
            <div 
              className="h-10 w-10 rounded-full border border-gray-300 shadow-sm"
              style={{ backgroundColor: selectedColor }}
            ></div>
            <input
              type="text"
              {...register('color')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Registra color código HEX"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-14">Ejemplo: #FF5733</p>
          {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color.message}</p>}
        </div>

        {/* --- Checkbox Activo --- */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 cursor-pointer">
            Activo
          </label>
        </div>

        {/* --- Botones --- */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/dashboard')} 
            type="button"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Crear
          </Button>
        </div>
      </form>
    </div>
  );
};