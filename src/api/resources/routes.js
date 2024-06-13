const router = require('express').Router()
const { verifyAdminToken } = require('../../middleware/AuthMiddleware')
const DepartmentService = require('../../services/DepartmentService')
const ResourcesHandler = require('./controller')
const departmentService = new DepartmentService()
const resourcesHandler = new ResourcesHandler(departmentService)

router.get("/resources/department", verifyAdminToken, resourcesHandler.getDepartments)

module.exports = router