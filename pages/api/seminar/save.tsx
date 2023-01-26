import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "../../../libs/backend/withHandler";
import client from "../../../libs/backend/client";
import { withApiSession } from "../../../libs/backend/withSession";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {


  if (req.method === "POST") {

    const {
      body: { title, abstract, category, tags, alias,
        draftFile, finalFile,
        waiver, skipReview, skipRevision,
        slotId
      },
      session: { user },
    } = req;

    const currentUser = await client.user.findUnique({
      where: { id: user?.id },
    });

    const currentSeminar = await client.seminar.findUnique({
      where: { alias: alias?.toString(), },
      include: {
        slot: true,
      }
    });

    if (currentUser.id != currentSeminar.presentedById) {
      return res.status(403).json({ ok: false, error: "Not allowed to access the seminar data." })
    }


    const updateProgress1 = async () => {

      const currentSeminar = await client.seminar.findUnique({
        where: {
          alias: alias?.toString(),
        },

      }); //Check the updates locally!

      if (!waiver &&
        !currentSeminar?.waiver &&
        +currentSeminar?.progress === 0 &&
        currentSeminar?.title &&
        currentSeminar?.abstract &&
        currentSeminar?.draftFile) {
        await client.seminar.update({
          where: {
            alias: alias?.toString(),
          },
          data: {
            progress: 1,
          },
        });
      }
    }

    const updateProgress3 = async () => {

      const currentSeminar = await client.seminar.findUnique({
        where: { alias: alias?.toString(), }
      }); //Check the updates locally!

      if (!waiver &&
        !currentSeminar?.waiver &&
        +currentSeminar?.progress === 2 && (
          currentSeminar?.skipRevision ||
          currentSeminar?.finalFile)) {
        await client.seminar.update({
          where: {
            alias: alias?.toString(),
          },
          data: {
            progress: 3,
          },
        });
      }
    }

    // progress: 3,




    if (title && title !== currentSeminar?.title) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          title,
        },
      });
    }

    if (abstract && abstract !== currentSeminar?.abstract) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          abstract,
        },
      });
    }

    if (category && category !== currentSeminar?.category) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          category,
        },
      });
    }

    if (tags && tags !== currentSeminar?.tags) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          tags,
        },
      });
    }

    const newDraftFilename = draftFile?.name + '.' + draftFile?.ext;
    if (draftFile && newDraftFilename !== currentSeminar?.draftFile) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          draftFile: newDraftFilename,
        },
      });
    }

    const newFinalFilename = finalFile?.name + '.' + finalFile?.ext;
    if (finalFile && newFinalFilename !== currentSeminar?.finalFile) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          finalFile: newFinalFilename,
        },
      });
    }


    // TODO: When selected slot. (IMPORTANT!! check the slot is not occupied first!)
    if (!waiver && slotId && slotId !== currentSeminar?.slot?.id) {
      console.log(slotId, currentSeminar?.slot?.id)
      const selectedSlot = await client.seminarslot.findUnique({
        where: {
          id: +slotId,
        }
      })

      if (!selectedSlot.seminarId) {

        await client.seminar.update({
          where: {
            alias: alias?.toString(),
          },
          data: {
            slot: {
              connect: {
                id: +slotId,
              }
            },
            progress: 4,
          },
        })
      }
      else {
        return res.status(503).json({ ok: false, error: '503' });

      }
    }


    //Skipping Review cannot be undone.
    if (skipRevision ^ currentSeminar?.skipRevision) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          skipRevision,
        },
      });
    }

    //Skipping Review cannot be undone.
    // if (skipReview ^ currentSeminar?.skipReview) {
    if (skipReview) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          skipReview,
          progress: 2,
        },
      });
    }
    
    //TODO: Waiver at anypoint (e.g. waiver @ progress 4,3,2,1 must be possible)
    //WAIVER cannot be undone.
    // if (waiver ^ currentSeminar?.waiver) {
      if (waiver) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          waiver,
          progress: -1,
          slot: {
            disconnect: true,
          },
        },
      });
    }

    updateProgress1();
    updateProgress3();





    //TODO: Progress to -1 when waiver accepted
    //TODO: Progress to 2 when skipped review
    //TODO: Progress to 3 when skipped finalFile
    //TODO: Progress to 3 when submitted finalFile

    res.json({ ok: true, })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);