import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../../libs/backend/withHandler";
import client from "../../../../libs/backend/client";
import { withApiSession } from "../../../../libs/backend/withSession";

const CategoryCode = {
  'MPE': 30,
  'CPE': 30,
  'DTE': 35,
  'OTE': 35,
  'ME': 30,
  'AE': 30,
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {
    res.json({ ok: false });
  }

  if (req.method === "POST") {

    const { query: { alias },
      body: { note, variance, category },
      session: { user } } = req;

    if (!alias) {
      return res.json({ ok: false });
    }

    //TODO: Restrict user if not participating.
    const currentUser = await client.user.findUnique({
      where: { id: user.id },
    });
    const authority = currentUser.position;
    if (authority < 2) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the data." })
    }

    const selectedProject = await client.project.findUnique({
      where: {
        alias: alias.toString()
      },

      include: {
        managers: {
          select: {
            user: {
              select: {
                name: true,
                userNumber: true,
              }
            },
          },
        },
      },
    })

    if (
      !selectedProject?.managers?.find((manager) => +manager.user.userNumber === +currentUser.userNumber)
      && authority < 3
    )
      return res.status(403).json({
        ok: false,
        error: { code: 403, message: "Not allowed to change the selected project." }
      })


    let updatedProject = null;
    switch (category) {
      case "MPE":
        updatedProject = await client.project.update({
          where: { id: selectedProject.id },
          data: {
            mpeBalance: selectedProject.mpeBalance - (+variance),
            mpeExeRate: +(100 * (1 - (selectedProject.mpeBalance - (+variance)) / selectedProject.mpePlanned) || 0).toFixed(0),
          },
        })
        break;
      case "CPE":
        updatedProject = await client.project.update({
          where: { id: selectedProject.id },
          data: {
            cpeBalance: selectedProject.cpeBalance - (+variance),
            cpeExeRate: +(100 * (1 - (selectedProject.cpeBalance - (+variance)) / selectedProject.cpePlanned) || 0).toFixed(0),
          },
        })
        break;
      case "DTE":
        updatedProject = await client.project.update({
          where: { id: selectedProject.id },
          data: {
            dteBalance: selectedProject.dteBalance - (+variance),
            dteExeRate: +(100 * (1 - (selectedProject.dteBalance - (+variance)) / selectedProject.dtePlanned) || 0).toFixed(0),
          },
        })
        break;
      case "OTE":
        updatedProject = await client.project.update({
          where: { id: selectedProject.id },
          data: {
            oteBalance: selectedProject.oteBalance - (+variance),
            oteExeRate: +(100 * (1 - (selectedProject.oteBalance - (+variance)) / selectedProject.otePlanned) || 0).toFixed(0),
          },
        })
        break;
      case "ME":
        updatedProject = await client.project.update({
          where: { id: selectedProject.id },
          data: {
            meBalance: selectedProject.meBalance - (+variance),
            meExeRate: +(100 * (1 - (selectedProject.meBalance - (+variance)) / selectedProject.mePlanned) || 0).toFixed(0),
          },
        })
        break;
      case "AE":
        updatedProject = await client.project.update({
          where: { id: selectedProject.id },
          data: {
            aeBalance: selectedProject.aeBalance - (+variance),
            aeExeRate: +(100 * (1 - (selectedProject.aeBalance - (+variance)) / selectedProject.aePlanned) || 0).toFixed(0),
          },
        })
        break;

      default:
        return res.status(400).json({
          ok: false,
          error: { code: 400, message: "Bad Category." }
        })
    }

    let correction = null;
    switch (category) {
      case "MPE":
      case "CPE":
      case "ME":
      case "AE":
        correction = await client.action.create({
          data: {
            kind: +CategoryCode[category],
            payload1: currentUser.id?.toString(),
            payload2: currentUser.name?.toString(),
            payload3: alias?.toString(),
            payload5: category?.toString(),
            payload6: note?.toString(),
            payload9: variance?.toString(), ////////////////
            status: 1,
            due: new Date(),
            completedAt: new Date(),
          },
        })
        break;
      case "DTE":
      case "OTE":
        correction = await client.action.create({
          data: {
            kind: +CategoryCode[category],
            payload1: currentUser.id?.toString(),
            payload2: currentUser.name?.toString(),
            payload3: alias?.toString(),
            payload5: category?.toString(),
            payload6: note?.toString(),
            payload7: variance?.toString(), ////////////////
            status: 1,
            due: new Date(),
            completedAt: new Date(),
          },
        })
        break;

      default:
        return res.status(400).json({
          ok: false,
          error: { code: 400, message: "Bad Category." }
        })
    }
        //TODO: Return ledger
        res.json({
          ok: true,
          updatedProject,
          correction,
        });
    }



  }

  export default withApiSession(
    withHandler({
      methods: ["POST"],
      handler,
    })
  );