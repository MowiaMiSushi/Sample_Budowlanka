import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Trash2, Archive, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { getMessages, updateMessage, deleteMessage } from '@/lib/dataService';
import moment from 'moment';
import 'moment/locale/pl';
import { useLanguage } from '@/contexts/LanguageContext';

const MessagesManager = ({ onUnreadCountChange }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deletingMessage, setDeletingMessage] = useState(null);
  
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    moment.locale('pl');
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getMessages();
      if (error) throw error;
      setMessages(data || []);
      
      const unreadCount = (data || []).filter(m => !m.is_read).length;
      if (onUnreadCountChange) onUnreadCountChange(unreadCount);

    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
      toast({
        title: t('admin.error'),
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus, currentIsRead) => {
    try {
      const updates = { status: newStatus };
      if (newStatus === 'archived') updates.is_read = true;
      if (newStatus === 'replied') updates.is_read = true;

      const { error } = await updateMessage(id, updates);
      if (error) throw error;

      setMessages(messages.map(m => m.id === id ? { ...m, ...updates } : m));
      
      const updatedMessages = messages.map(m => m.id === id ? { ...m, ...updates } : m);
      const unreadCount = updatedMessages.filter(m => !m.is_read).length;
      if (onUnreadCountChange) onUnreadCountChange(unreadCount);

      toast({
        title: t('admin.messages.toast.statusUpdate'),
      });
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, ...updates });
      }

    } catch (err) {
      console.error('Error updating status:', err);
      toast({ title: t('admin.error'), variant: "destructive" });
    }
  };

  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const { error } = await updateMessage(id, { is_read: !currentStatus });
      if (error) throw error;

      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
      
      const updatedMessages = messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m);
      const unreadCount = updatedMessages.filter(m => !m.is_read).length;
      if (onUnreadCountChange) onUnreadCountChange(unreadCount);

      toast({ 
        title: t('admin.messages.toast.statusUpdate')
      });

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: !currentStatus });
      }
    } catch (err) {
      console.error('Error toggling read status:', err);
      toast({ title: t('admin.error'), variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deletingMessage) return;
    try {
      const { error } = await deleteMessage(deletingMessage.id);
      if (error) throw error;

      setMessages(messages.filter(m => m.id !== deletingMessage.id));
      
      const updatedMessages = messages.filter(m => m.id !== deletingMessage.id);
      const unreadCount = updatedMessages.filter(m => !m.is_read).length;
      if (onUnreadCountChange) onUnreadCountChange(unreadCount);

      toast({ title: t('admin.messages.toast.deleted') });
      setDeletingMessage(null);
      if (selectedMessage?.id === deletingMessage.id) setSelectedMessage(null);
    } catch (err) {
      console.error('Error deleting message:', err);
      toast({ title: t('admin.error'), variant: "destructive" });
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'new') return !m.is_read || m.status === 'new';
    if (filter === 'replied') return m.status === 'replied';
    if (filter === 'archived') return m.status === 'archived';
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  const getStatusLabel = (status) => {
    switch(status) {
      case 'new': return t('admin.messages.status.new');
      case 'replied': return t('admin.messages.status.replied');
      case 'archived': return t('admin.messages.status.archived');
      default: return status;
    }
  };

  const getFilterLabel = (f) => {
    switch(f) {
      case 'all': return t('admin.messages.filter.all');
      case 'new': return t('admin.messages.filter.new');
      case 'replied': return t('admin.messages.filter.replied');
      case 'archived': return t('admin.messages.filter.archived');
      default: return f;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
            <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {unreadCount} {t('admin.messages.newBadge')}
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'new', 'replied', 'archived'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              onClick={() => setFilter(f)}
              size="sm"
              className={`capitalize ${filter === f ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'text-gray-600'}`}
            >
              {getFilterLabel(f)}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={fetchMessages} title={t('admin.refresh')}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
             {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
             ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{t('admin.messages.empty')}</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">{t('admin.messages.table.status')}</th>
                  <th className="px-6 py-4">{t('admin.messages.table.from')}</th>
                  <th className="px-6 py-4">{t('admin.messages.table.message')}</th>
                  <th className="px-6 py-4">{t('admin.messages.table.date')}</th>
                  <th className="px-6 py-4 text-right">{t('admin.messages.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredMessages.map((msg) => (
                    <motion.tr
                      key={msg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`hover:bg-gray-50 transition-colors ${!msg.is_read ? 'bg-orange-50/40' : ''}`}
                    >
                      <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                           ${msg.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                             msg.status === 'replied' ? 'bg-green-100 text-green-800' : 
                             'bg-gray-100 text-gray-800'}`}>
                           {getStatusLabel(msg.status)}
                         </span>
                      </td>
                      <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                        <div className="font-medium text-gray-900">{msg.name}</div>
                        <div className="text-gray-500 text-xs">{msg.email}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-gray-600 cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                        {msg.message}
                      </td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap cursor-pointer" onClick={() => setSelectedMessage(msg)}>
                        {moment(msg.created_at).format('D MMMM YYYY')}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedMessage(msg)}
                            className="text-gray-400 hover:text-orange-500"
                            title="Wyświetl wiadomość"
                         >
                           <Eye className="w-4 h-4" />
                         </Button>
                         <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingMessage(msg);
                            }}
                            className="text-gray-400 hover:text-red-600"
                            title={t('admin.messages.action.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start mr-6">
                    <div>
                        <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                           {t('admin.messages.detail.title')} {selectedMessage.name}
                           {!selectedMessage.is_read && <span className="bg-orange-500 w-2 h-2 rounded-full"></span>}
                        </DialogTitle>
                        <DialogDescription className="text-gray-700">
                            {t('admin.messages.detail.received')} {moment(selectedMessage.created_at).format('LLLL')}
                        </DialogDescription>
                    </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 my-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded shadow-sm text-gray-500">
                            <Mail className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-900 uppercase font-semibold">{t('admin.messages.detail.email')}</p>
                            <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline text-gray-800">{selectedMessage.email}</a>
                        </div>
                    </div>
                    {selectedMessage.phone && (
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded shadow-sm text-gray-500">
                                <Phone className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-900 uppercase font-semibold">{t('admin.messages.detail.phone')}</p>
                                <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:underline text-gray-800">{selectedMessage.phone}</a>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm min-h-[100px]">
                    <p className="text-xs text-gray-900 uppercase font-semibold mb-2">{t('admin.messages.detail.content')}</p>
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-6 border-t pt-4">
                 <div className="flex flex-1 gap-2 justify-start">
                    <Button 
                        variant="outline" 
                        onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.is_read)}
                        className="flex-1 sm:flex-none text-gray-800 hover:bg-gray-100 border-gray-300"
                    >
                        {selectedMessage.is_read ? t('admin.messages.action.markUnread') : t('admin.messages.action.markRead')}
                    </Button>
                    {selectedMessage.status !== 'archived' && (
                        <Button 
                            variant="outline" 
                            onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                            className="flex-1 sm:flex-none text-gray-800 hover:bg-gray-100 border-gray-300"
                        >
                            <Archive className="w-4 h-4 mr-2" />
                            {t('admin.messages.action.archive')}
                        </Button>
                    )}
                 </div>
                 
                 <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <Button 
                        variant="destructive" 
                        onClick={() => setDeletingMessage(selectedMessage)}
                        className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('admin.messages.action.delete')}
                    </Button>
                 </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingMessage} onOpenChange={() => setDeletingMessage(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">{t('admin.messages.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              {t('admin.messages.delete.desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">{t('admin.messages.action.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MessagesManager;