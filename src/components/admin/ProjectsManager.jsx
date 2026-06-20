import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/dataService';
import { PROJECT_DELETE_CONFIRM_PHRASE } from '@/lib/siteConfig';
import { useLanguage } from '@/contexts/LanguageContext';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isDeletePhraseValid = deleteConfirmPhrase === PROJECT_DELETE_CONFIRM_PHRASE;

  const closeDeleteDialog = () => {
    setDeletingProject(null);
    setDeleteConfirmPhrase('');
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'interior',
    techniques: '',
    images: ''
  });
  
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getProjects();
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
      toast({
        title: t('admin.error'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const techniquesArray = formData.techniques
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const imagesArray = formData.images
        .split(/[\n,]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0 && item.startsWith('http'));

      const now = new Date().toISOString();

      const projectData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        techniques: techniquesArray,
        images: imagesArray,
        updated_at: now
      };

      if (editingProject) {
        const { error } = await updateProject(editingProject.id, projectData);
        if (error) throw error;

        toast({
          title: t('admin.projects.toast.updated'),
          description: t('admin.projects.toast.updated.desc'),
        });
      } else {
        projectData.created_at = now;
        const { error } = await createProject(projectData);
        if (error) throw error;

        toast({
          title: t('admin.projects.toast.added'),
          description: t('admin.projects.toast.added.desc'),
        });
      }

      setIsAddModalOpen(false);
      setEditingProject(null);
      setFormData({ title: '', description: '', category: 'interior', techniques: '', images: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: t('admin.error'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      category: project.category || 'interior',
      techniques: project.techniques ? project.techniques.join(', ') : '',
      images: project.images ? project.images.join('\n') : ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingProject) return;

    if (!isDeletePhraseValid) {
      toast({
        title: t('admin.error'),
        description: t('admin.projects.delete.phraseMismatch'),
        variant: 'destructive',
      });
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await deleteProject(deletingProject.id);
      if (error) throw error;

      toast({
        title: t('admin.projects.toast.deleted'),
        description: t('admin.projects.toast.deleted.desc'),
      });

      closeDeleteDialog();
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: t('admin.error'),
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', category: 'interior', techniques: '', images: '' });
    setIsAddModalOpen(true);
  };

  const getCategoryLabel = (cat) => {
      switch(cat) {
          case 'interior': return t('admin.projects.category.interior');
          case 'renovation': return t('admin.projects.category.renovation');
          case 'finishing': return t('admin.projects.category.finishing');
          default: return cat;
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('admin.projects.title')}</h2>
        <div className="flex items-center gap-2">
          <Button 
            onClick={fetchProjects} 
            variant="ghost" 
            size="sm"
            className="text-gray-500 hover:bg-gray-100"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('admin.refresh')}
          </Button>
          <Button
            onClick={openAddModal}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('admin.projects.add')}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchProjects} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            {t('admin.retry')}
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="aspect-video overflow-hidden bg-gray-100 relative group">
                <img
                  src={project.images?.[0] || 'https://images.unsplash.com/photo-1556889380-6e8394ddd7ad'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.images && project.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                    +{project.images.length - 1} więcej
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  {project.updated_at && (
                    <span className="text-xs text-gray-400" title="Ostatnia aktualizacja">
                      {new Date(project.updated_at).toLocaleDateString('pl-PL')}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full capitalize mb-4">
                  {getCategoryLabel(project.category)}
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(project)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {t('admin.projects.edit')}
                  </Button>
                  <Button
                    onClick={() => setDeletingProject(project)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {t('admin.projects.delete')}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600">{t('admin.projects.empty')}</p>
        </div>
      )}

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {editingProject ? t('admin.projects.modal.edit') : t('admin.projects.modal.add')}
            </DialogTitle>
            <DialogDescription>
              {t('admin.projects.modal.desc')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.projects.form.title')}
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.projects.form.description')}
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.projects.form.category')}
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="interior">{t('admin.projects.category.interior')}</option>
                <option value="renovation">{t('admin.projects.category.renovation')}</option>
                <option value="finishing">{t('admin.projects.category.finishing')}</option>
              </select>
            </div>

            <div>
              <label htmlFor="techniques" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.projects.form.techniques')}
              </label>
              <input
                id="techniques"
                type="text"
                value={formData.techniques}
                onChange={(e) => setFormData({ ...formData, techniques: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="Gładzie, Malowanie, Podłogi"
              />
            </div>

            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.projects.form.images')}
              </label>
              <textarea
                id="images"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white font-mono text-xs"
                placeholder="https://example.com/image1.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">{t('admin.projects.form.imagesHelp')}</p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProject(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900"
                disabled={isSubmitting}
              >
                {t('admin.projects.form.cancel')}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    {t('admin.projects.form.processing')}
                  </>
                ) : (
                  editingProject ? t('admin.projects.form.update') : t('admin.projects.form.save')
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingProject} onOpenChange={(open) => { if (!open) closeDeleteDialog(); }}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">{t('admin.projects.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 space-y-3">
              <span className="block">{t('admin.projects.delete.desc')}</span>
              {deletingProject && (
                <span className="block font-semibold text-gray-900">
                  „{deletingProject.title}”
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <label htmlFor="delete-confirm-phrase" className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.projects.delete.phraseLabel')}
            </label>
            <input
              id="delete-confirm-phrase"
              type="text"
              value={deleteConfirmPhrase}
              onChange={(e) => setDeleteConfirmPhrase(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
            />
            <p className="text-xs text-gray-500 mt-2">{t('admin.projects.delete.phraseHint')}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-200 text-gray-900 hover:bg-gray-300"
              disabled={isDeleting}
            >
              {t('admin.projects.form.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={!isDeletePhraseValid || isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  {t('admin.projects.form.processing')}
                </>
              ) : (
                t('admin.projects.delete.confirm')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsManager;