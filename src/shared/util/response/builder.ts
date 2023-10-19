import { Response } from "express";

export const buildResponseSuccess = (
    res: Response,
    code: number,
    message: string,
    data?: unknown,
) => {
    res.setHeader("Content-Type", "application/json");
    res.status(code).json(
        data
            ? {
                  status: "success",
                  message: message,
                  data: data,
              }
            : {
                  status: "success",
                  message: message,
              },
    );
};

export const buildResponseError = (
    res: Response,
    code: number,
    error: string,
) => {
    res.setHeader("Content-Type", "application/json");
    res.status(code).json({
        status: "failed",
        error: error,
    });
};
