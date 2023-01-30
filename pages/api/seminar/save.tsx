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

    console.log(req.body)
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


    const updateStage2 = async () => {

      const currentSeminar = await client.seminar.findUnique({
        where: {
          alias: alias?.toString(),
        },

      }); //Check the updates locally!

      if (!waiver &&
        !currentSeminar?.waiver &&
        +currentSeminar?.currentStage === 1 &&
        currentSeminar?.title &&
        currentSeminar?.abstract &&
        currentSeminar?.draftFile) {
        await client.seminar.update({
          where: {
            alias: alias?.toString(),
          },
          data: {
            currentStage: 2,
          },
        });
      }
    }

    const updateStage4 = async () => {

      const currentSeminar = await client.seminar.findUnique({
        where: { alias: alias?.toString(), }
      }); //Check the updates locally!

      console.log(currentSeminar.currentStage)

      if (!waiver &&
        !currentSeminar?.waiver &&
        +currentSeminar?.currentStage === 3 && 
        ( currentSeminar?.skipRevision ||
          currentSeminar?.finalFile)) {
            console.log("Setting stage as 4.")
        await client.seminar.update({
          where: {
            alias: alias?.toString(),
          },
          data: {
            currentStage: 4,
          },
        });
      }
    }

    // currentStage: 3,




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



    updateStage2();

    //Skipping Review cannot be undone.
    // if (skipReview ^ currentSeminar?.skipReview) {
      if (skipReview && currentSeminar?.currentStage == 2) {
        await client.seminar.update({
          where: {
            alias: alias?.toString(),
          },
          data: {
            skipReview,
            currentStage: 3,
          },
        });
      }

    if (skipRevision ^ (currentSeminar?.skipRevision ? 1 : 0)) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          skipRevision,
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



    updateStage4();

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
                    currentStage: 5,
                  },
                })
              }
              else {
                return res.status(503).json({ ok: false, error: '503' });
        
              }
            }


    
    //TODO: Waiver at anypoint (e.g. waiver @ currentStage 4,3,2,1 must be possible)
    //WAIVER cannot be undone.
    // if (waiver ^ currentSeminar?.waiver) {
      if (waiver) {
      await client.seminar.update({
        where: {
          alias: alias?.toString(),
        },
        data: {
          waiver,
          currentStage: 0,
          slot: {
            disconnect: true,
          },
        },
      });
    }


    res.json({ ok: true, })
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);