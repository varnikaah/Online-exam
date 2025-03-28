const express = require("express");
const router = express.Router();

let jwt = require("jsonwebtoken"); //import jwt
const { user } = require("../../config");
const pool = require("../../models/dbCon"); //importing db-pool for query
const sql = require("mssql");

const { verifyToken } = require("../../services/jwtToken");

//api for answers

router.get(
  "/questions/:topic/:department/:set",
  verifyToken,
  async (req, res) => {
    const topic = req.params.topic;
    const department = req.params.department;
    const set = req.params.set;
    try {
      const users = req.payLoad;

      //qtopicIn
      const out = await pool
        .request()
        .input("qtopicIn", sql.VarChar, topic)
        .input("deptIn", sql.VarChar, department)
        .input("setIn", sql.VarChar, set)
        .query(
          "SELECT [SetQNo], questionsList.[qno] ,[qtopic] ,[question] ,[option_a] ,[option_b] ,[option_c] ,[option_d] ,[option_e] ,[option_f] ,[option_a_image] ,[option_b_image] ,[option_c_image] ,[option_d_image] , [option_e_image] ,[option_f_image] ,[question_image] FROM [dbo].[Set_QNo_Mapping] as setQ_Mapping left join [dbo].[Questions] as questionsList on setQ_Mapping.[QNo] = questionsList.[qno] and setQ_Mapping.Department = questionsList.department where setQ_Mapping.[Set] = @setIn AND setQ_Mapping.Department = @deptIn order by SetQNo"
        );

      res.status(200);
      res.send(out.recordset);
    } catch {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
  }
);

router.get("/answers", verifyToken, async (req, res) => {
  try {
    const users = req.payLoad;
    const out = await pool
      .request()
      .input("userIn", sql.VarChar, users.user)
      .query(
        "SELECT [user] ,[qno] ,[answer] FROM [dbo].[answers] where [user] = @userIn"
      );

    const resObjWithQno = {};

    await out.recordset.forEach((item) => {
      const { user, qno, answer } = item;
      resObjWithQno[qno] = answer;
    });
    res.status(200);
    res.send(resObjWithQno);
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//get api for timeleft
router.get("/timeleft", verifyToken, async (req, res) => {
  try {
    const users = req.payLoad;
    const out = await pool
      .request()
      .input("userIn", sql.VarChar, users.user)
      .query(
        "SELECT TOP (1000) [user] ,[timeleft] FROM [dbo].[usertimer] where [user] = @userIn"
      );

    res.status(200);
    res.send(out.recordset[0]);
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

router.get("/getanswers", verifyToken, async (req, res) => {
  try {
    const users = jwt.payLoad;

    const out = await pool
      .request()
      .input("userIn", sql.VarChar, users.user)
      .query(
        "SELECT [qno] , [answer] FROM [dbo].[Questions]  where [user] = @userIn"
      );

    res.status(200);
    res.send(out.recordset);
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//testing jwt
router.get("/abc", verifyToken, async (req, res) => {
  try {
    const users = req.payLoad;

    res.status(200);
    res.send(users);
  } catch {
    return res
      .status(500)
      .send({ auth: false, message: "Failed to authenticate token." });
  }
});

//code for checking authentication
// const jwttoken = req.headers["x-access-token"];

//   if (!jwttoken)
//     return res
//       .status(401)
//       .send({ auth: false, message: "Authentication required." });

//   const TokenArray = jwttoken.split(" ");
//   const token = TokenArray[1];

//   try {
//     const verified = await jwt.verify(token, process.env.AUTHTOKEN);

//     const users = jwt.decode(token);

//     // console.log(users.user);

//     const out = await pool.query(
//       'SELECT "user", answers, "time" FROM public.answers where "user" = $1;',
//       [users.user]
//     );
//     res.send(out.rows);
//   } catch {
//     return res
//       .status(500)
//       .send({ auth: false, message: "Failed to authenticate token." });
//   }

router.get("/testing", verifyToken, async (req, res) => {
  try {
    const dataSet = await pool
      .request()
      .input("input_parameter", sql.VarChar, "1234567890")
      .query(
        "SELECT  [user] ,[pass] ,[totaltime] FROM  [dbo].[users] where [user] = @input_parameter"
      );

    res.send(dataSet.recordsets);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
