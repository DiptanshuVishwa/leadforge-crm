import { Response } from 'express';
import { Parser } from 'json2csv';
import Lead from '../models/Lead';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = catchAsync(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const queryObj: any = {};

  if (req.query.status) {
    queryObj.status = req.query.status;
  }

  if (req.query.source) {
    queryObj.source = req.query.source;
  }

  if (req.query.search) {
    queryObj.$or = [
      { name: { $regex: req.query.search as string, $options: 'i' } },
      { email: { $regex: req.query.search as string, $options: 'i' } },
    ];
  }

  // Sort
  let sort = {};
  if (req.query.sort === 'oldest') {
    sort = { createdAt: 1 };
  } else {
    sort = { createdAt: -1 }; // latest default
  }

  const leads = await Lead.find(queryObj)
    .populate('createdBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Lead.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    message: 'Leads fetched successfully',
    data: leads,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLead = catchAsync(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  res.status(200).json({
    success: true,
    data: lead,
  });
});

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private (Admin only)
export const createLead = catchAsync(async (req: AuthRequest, res: Response) => {
  req.body.createdBy = req.user?.id;

  const lead = await Lead.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: lead,
  });
});

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = catchAsync(async (req: AuthRequest, res: Response) => {
  let lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Lead updated successfully',
    data: lead,
  });
});

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin only)
export const deleteLead = catchAsync(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  await lead.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Lead deleted successfully',
    data: {},
  });
});

// @desc    Export leads to CSV
// @route   GET /api/leads/export/csv
// @access  Private (Admin only)
export const exportLeadsCsv = catchAsync(async (req: AuthRequest, res: Response) => {
  // Build query (reuse from getLeads without pagination)
  const queryObj: any = {};

  if (req.query.status) {
    queryObj.status = req.query.status;
  }

  if (req.query.source) {
    queryObj.source = req.query.source;
  }

  if (req.query.search) {
    queryObj.$or = [
      { name: { $regex: req.query.search as string, $options: 'i' } },
      { email: { $regex: req.query.search as string, $options: 'i' } },
    ];
  }

  const leads = await Lead.find(queryObj).populate('createdBy', 'name').lean();

  if (leads.length === 0) {
    throw new AppError('No leads found to export', 404);
  }

  const fields = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'Status', value: 'status' },
    { label: 'Source', value: 'source' },
    { label: 'Created By', value: 'createdBy.name' },
    { label: 'Created At', value: 'createdAt' },
  ];

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.status(200).send(csv);
});
