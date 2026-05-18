import express from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCsv,
} from '../controllers/lead.controller';
import { protect, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createLeadSchema, updateLeadSchema } from '../validations/lead.validation';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/export/csv').get(authorize('admin'), exportLeadsCsv);

router
  .route('/')
  .get(getLeads)
  .post(authorize('admin'), validate(createLeadSchema), createLead);

router
  .route('/:id')
  .get(getLead)
  .put(validate(updateLeadSchema), updateLead)
  .delete(authorize('admin'), deleteLead);

export default router;
