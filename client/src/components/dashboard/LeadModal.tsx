import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLeadFn, updateLeadFn, getLeadFn } from '../../api/leads';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
}

export const LeadModal = ({ isOpen, onClose, leadId }: LeadModalProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!leadId;

  const { data: leadData, isLoading: isLoadingLead } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: () => getLeadFn(leadId!),
    enabled: isEditing && isOpen,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      status: 'New',
      source: 'Website',
    },
  });

  useEffect(() => {
    if (leadData?.data) {
      reset({
        name: leadData.data.name,
        email: leadData.data.email,
        status: leadData.data.status,
        source: leadData.data.source,
      });
    } else if (!isEditing) {
      reset({ status: 'New', source: 'Website', name: '', email: '' });
    }
  }, [leadData, isEditing, reset, isOpen]);

  const createMutation = useMutation({
    mutationFn: createLeadFn,
    onSuccess: () => {
      toast.success('Lead created successfully');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create lead');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateLeadFn,
    onSuccess: () => {
      toast.success('Lead updated successfully');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update lead');
    },
  });

  const onSubmit = (data: LeadFormValues) => {
    if (isEditing) {
      updateMutation.mutate({ id: leadId!, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative transform overflow-hidden rounded-xl bg-white dark:bg-dark-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Lead' : 'Add New Lead'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoadingLead ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input {...register('name')} className="mt-1 input-field" placeholder="Lead Name" />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input {...register('email')} type="email" className="mt-1 input-field" placeholder="email@example.com" />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select {...register('status')} className="mt-1 input-field">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                  {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
                  <select {...register('source')} className="mt-1 input-field">
                    <option value="Website">Website</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Referral">Referral</option>
                  </select>
                  {errors.source && <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>}
                </div>

                <div className="mt-6 flex justify-end gap-3 pb-2">
                  <button type="button" onClick={onClose} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading} className="btn-primary">
                    {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
