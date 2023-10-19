import Joi from "joi";

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-__+.]).+$/;

export const addUserMapper = Joi.object().keys({
    nama: Joi.string()
        .regex(/^[a-zA-Z ]*$/)
        .messages({
            "string.pattern.base":
                "{{#label}} with value {:[.]} must only contain letter or whitespace",
        })
        .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .max(20)
        .regex(passwordRegex)
        .messages({
            "string.pattern.base":
                "{{#label}} with value {:[.]} must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
        })
        .required(),
});

export const loginMapper = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .max(20)
        .regex(passwordRegex)
        .messages({
            "string.pattern.base":
                "{{#label}} with value {:[.]} must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
        })
        .required(),
});

export const logoutMapper = Joi.object().keys({
    id: Joi.string().length(36).required(),
});

export const getUserProfileMapper = Joi.object().keys({
    id: Joi.string().length(36).required(),
});

export const updateUserMapper = Joi.object().keys({
    id: Joi.string().length(36).required(),
    nama: Joi.string()
        .regex(/^[a-zA-Z ]*$/)
        .messages({
            "string.pattern.base":
                "{{#label}} with value {:[.]} must only contain letter or whitespace",
        }),
    email: Joi.string().email(),
    password: Joi.string()
        .min(8)
        .max(20)
        .messages({
            "string.pattern.base":
                "{{#label}} with value {:[.]} must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
        })
        .regex(passwordRegex),
});

export const deleteUserMapper = Joi.object().keys({
    id: Joi.string().length(36).required(),
});
