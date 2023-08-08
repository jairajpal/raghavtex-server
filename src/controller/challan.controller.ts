import express, { Request, Response, Router } from "express";
import { generateResponse } from "../utils/helper";
import moment from "moment";
const Model = require("../model/index");

export const createUserChallan = async (req: Request, res: Response) => {
  try {
    req.body.isDispatch = req.body.isDispatch || false;

    req.body.data.map(async (data: any) => {
      data.date = req.body.date;
      data.from = req.body.from;
      data.userId = req.body.userId;
      data.challan_number = parseInt(req.body.challan_number);
      data.quantity = parseInt(data.quantity);
      data.weight = parseFloat(data.weight);
      data.isDispatch = req.body.isDispatch;
      if (data.type) {
        let check = await Model.Type.findOne({
          name: data.type,
          isDispatch: req.body.isDispatch,
        });
        if (!check)
          await Model.Type.create({
            name: data.type,
            userId: req.body.userId,
            isDispatch: req.body.isDispatch,
          });
      }
      if (data.color) {
        let check = await Model.Color.findOne({
          name: data.color,
          isDispatch: req.body.isDispatch,
        });
        if (!check)
          await Model.Color.create({
            name: data.color,
            userId: req.body.userId,
            isDispatch: req.body.isDispatch,
          });
      }
      if (data.size) {
        let check = await Model.Color.findOne({
          name: data.size,
          isDispatch: req.body.isDispatch,
        });
        if (!check)
          await Model.Size.create({
            name: data.size,
            userId: req.body.userId,
            isDispatch: req.body.isDispatch,
          });
      }
    });

    if (req.body.data[0].from) {
      let check = await Model.Company.findOne({
        name: req.body.data[0].from,
        isDispatch: req.body.isDispatch,
      });
      if (!check)
        await Model.Company.create({
          name: req.body.data[0].from,
          userId: req.body.userId,
          isDispatch: req.body.isDispatch,
        });
    }
    let challan = await Model.Challan.insertMany(req.body.data);

    return res
      .status(201)
      .send(generateResponse(201, "Challan created successfully", challan));
  } catch (err: any) {
    return res.status(500).send(generateResponse(500, err.message, {}));
  }
};

export const editUserChallan = async (req: Request, res: Response) => {
  try {
    let challan = await Model.Challan.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { upsert: true }
    );

    return res
      .status(201)
      .send(generateResponse(201, "Challan edited successfully", challan));
  } catch (err: any) {
    return res.status(500).send(generateResponse(500, err.message, {}));
  }
};

export const createCompany = async (req: Request, res: Response) => {
  try {
    let company = await Model.Company.create(req.body);

    return res
      .status(201)
      .send(generateResponse(201, "Company added successfully", company));
  } catch (err: any) {
    return res.status(500).send(generateResponse(500, err.message, {}));
  }
};

export const editCompany = async (req: Request, res: Response) => {
  try {
    let company = await Model.Company.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { upsert: true }
    );

    return res
      .status(201)
      .send(generateResponse(201, "Company edited successfully", company));
  } catch (err: any) {
    return res.status(500).send(generateResponse(500, err.message, {}));
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    let company = await Model.Company.find({ isDelete: false });

    return res
      .status(201)
      .send(generateResponse(201, "Company fetched successfully", company));
  } catch (err: any) {
    return res.status(500).send(generateResponse(500, err.message, {}));
  }
};

export const getUserChallansByUserId = async (req: any, res: Response) => {
  try {
    const challanNumberFilter = parseInt(req.query.challanNumberFilter);
    let startDate = new Date(req.query.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(req.query.endDate);
    endDate.setHours(23, 59, 59, 999);
    const fromFilter = req.query.fromFilter;
    const typeFilter = req.query.typeFilter;
    const colorFilter = req.query.colorFilter;
    const sizeFilter = req.query.sizeFilter || "";
    const isDispatch =
      req.query.isDispatch.toLowerCase() === "false" ? false : true;

    const pipeline = [];

    if (challanNumberFilter) {
      pipeline.push({ $match: { challan_number: challanNumberFilter } });
    } else {
      // Add other filters as needed
      if (startDate && endDate) {
        pipeline.push({ $match: { date: { $gte: startDate, $lte: endDate } } });
      }
      if (fromFilter && fromFilter.length) {
        pipeline.push({ $match: { from: { $in: fromFilter } } });
      }
      if (typeFilter && typeFilter.length) {
        pipeline.push({ $match: { type: { $in: typeFilter } } });
      }
      if (colorFilter && colorFilter.length) {
        pipeline.push({ $match: { color: { $in: colorFilter } } });
      }
      if (sizeFilter) {
        pipeline.push({ $match: { size: sizeFilter } });
      }
      pipeline.push({ $match: { isDispatch: isDispatch } });
    }

    const challan = await Model.Challan.aggregate(pipeline);

    pipeline.push({
      $group: {
        _id: null,
        totalWeight: { $sum: "$weight" },
        totalQuantity: { $sum: "$quantity" },
      },
    });

    pipeline.push({
      $project: {
        _id: 0,
        totalWeight: 1,
        totalQuantity: 1,
      },
    });

    // Execute the aggregation pipeline
    const result = await Model.Challan.aggregate(pipeline);

    // The result will contain the totalWeight and totalQuantity for the filtered query

    if (req.user._id !== req.query.userId) {
      return res.status(401).send(
        generateResponse(401, "unauthorised request", {
          challan,
          result: result[0],
        })
      );
    }

    return res.status(200).send(
      generateResponse(200, "Challan fetched successfully", {
        challan,
        result: result[0],
      })
    );
  } catch (error: any) {
    return res.status(500).send(generateResponse(500, error.message, {}));
  }
};

export const getDropDownFilter = async (req: any, res: Response) => {
  try {
    const isDispatch =
      req.query.isDispatch.toLowerCase() === "false" ? false : true;
    let color = await Model.Color.find({ isDispatch })
      .sort({ _id: -1 })
      .lean()
      .exec();
    let type = await Model.Type.find({ isDispatch })
      .sort({ _id: -1 })
      .lean()
      .exec();
    let from = await Model.Company.find({ isDispatch })
      .sort({ _id: -1 })
      .lean()
      .exec();
    let size = await Model.Size.find({ isDispatch })
      .sort({ _id: -1 })
      .lean()
      .exec();

    if (req.user._id !== req.query.userId) {
      return res.status(401).send(
        generateResponse(401, "unauthorised request", {
          color,
          type,
          from,
          size,
        })
      );
    }

    return res.status(200).send(
      generateResponse(200, "Challan fetched successfully", {
        color,
        type,
        from,
        size,
      })
    );
  } catch (error: any) {
    return res.status(500).send(generateResponse(500, error.message, {}));
  }
};

export const getDropDown = async (req: any, res: Response) => {
  try {
    const search = req.query.search;
    const type = req.query.type;
    const isDispatch = req.query.isDispatch || false;
    let data;
    if (type === "from") {
      data = await Model.Company.find({
        name: { $regex: new RegExp(search, "i") },
        isDispatch,
      })
        .sort({ _id: -1 })
        .lean()
        .exec();
    } else if (type === "color") {
      data = await Model.Color.find({
        name: { $regex: new RegExp(search, "i") },
        isDispatch,
      })
        .sort({ _id: -1 })
        .lean()
        .exec();
    } else if (type === "type") {
      data = await Model.Type.find({
        name: { $regex: new RegExp(search, "i") },
        isDispatch,
      })
        .sort({ _id: -1 })
        .lean()
        .exec();
    } else if (type === "size") {
      data = await Model.Size.find({
        name: { $regex: new RegExp(search, "i") },
        isDispatch,
      })
        .sort({ _id: -1 })
        .lean()
        .exec();
    }

    if (req.user._id !== req.query.userId) {
      return res
        .status(401)
        .send(generateResponse(401, "unauthorised request", data));
    }

    return res
      .status(200)
      .send(generateResponse(200, "Model.Challan fetched successfully", data));
  } catch (error: any) {
    return res.status(500).send(generateResponse(500, error.message, {}));
  }
};
