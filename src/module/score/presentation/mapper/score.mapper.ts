import Joi from "joi";

export const AddScoreMapper = Joi.object().keys({
    nama: Joi.string().required(),
    score: Joi.string().required(),
});

export const UpdateScoreMapper = Joi.object().keys({
    id: Joi.string().required(),
    nama: Joi.string().required(),
    score: Joi.string().required(),
});

export const DeleteScoreMapper = Joi.object().keys({
    id: Joi.string().required(),
});
