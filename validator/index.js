exports.userSignupValidator = (req, res, next) => {
    req.check('name', "Name is required").notEmpty()
    req.check('email', "Email have to be between 5 to 32 characters")
        // .matches(/.+\@.+\..+/)
        // Better email validation REGEX
        .matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .withMessage("Email us not in the proper form")
        .isLength({
            min: 5, max: 32
        })

    req.check('password', "Password is required").notEmpty()
    req.check('password')
        .isLength({min: 6})
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage("Password have to contain a number");
    const errors = req.validationErrors();
    if (errors) {
        console.log(errors)
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
next();
}