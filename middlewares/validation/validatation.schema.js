const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors

        return res.status(400).json({
            success: false,
            message: result.error.issues[0]?.message || "Validation failed",
            errors,
        })
    }

    req.body = result.data
    next()
}

export const validateParams = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.params)

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors

        return res.status(400).json({
            success: false,
            message: result.error.issues[0]?.message || "Validation failed",
            errors,
        })
    }

    req.params = result.data
    next()
}

export default validate
