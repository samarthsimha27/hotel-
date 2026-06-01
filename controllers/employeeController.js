import Employee from '../models/Employee.js';

// @desc    Get all employees directory from MongoDB
// @route   GET /api/employees
// @access  Private (Admin & Customer)
export const getEmployees = async (req, res, next) => {
  try {
    const list = await Employee.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new employee profile in MongoDB
// @route   POST /api/employees
// @access  Private (Admin Only)
export const createEmployee = async (req, res, next) => {
  try {
    const { name, role, status, employeeId } = req.body;

    if (!name || !role) {
      res.status(400);
      throw new Error('Please provide name and role fields.');
    }

    // Dynamic ID compilation if corporate ID is vacant
    const nextIdNum = Math.floor(111 + Math.random() * 888);
    const compiledId = employeeId || `LGH-EM-${nextIdNum}`;

    // Verify corporate ID uniqueness in MongoDB
    const idExists = await Employee.findOne({ employeeId: compiledId });
    if (idExists) {
      res.status(400);
      throw new Error(`Corporate ID ${compiledId} already registered in database.`);
    }

    const emp = await Employee.create({
      name,
      role,
      status: status || 'Active',
      employeeId: compiledId
    });

    res.status(201).json({
      success: true,
      message: 'Employee cataloged successfully in MongoDB.',
      data: emp
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an employee profile in MongoDB by corporate employeeId
// @route   PUT /api/employees/:id
// @access  Private (Admin Only)
export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params; // corporate employeeId
    const { name, role, status } = req.body;

    const emp = await Employee.findOneAndUpdate(
      { employeeId: id },
      { name, role, status },
      { new: true, runValidators: true }
    );

    if (!emp) {
      res.status(404);
      throw new Error('Employee not registered under this ID.');
    }

    res.status(200).json({
      success: true,
      message: 'Roster profile updated successfully in MongoDB.',
      data: emp
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an employee profile in MongoDB
// @route   DELETE /api/employees/:id
// @access  Private (Admin Only)
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params; // corporate employeeId

    const emp = await Employee.findOneAndDelete({ employeeId: id });

    if (!emp) {
      res.status(404);
      throw new Error('Employee not registered under this ID.');
    }

    res.status(200).json({
      success: true,
      message: 'Employee discharged successfully from MongoDB.',
      data: emp
    });
  } catch (error) {
    next(error);
  }
};
