import dayjs from "dayjs";
import { client, db } from "."
import { goalCompletions, goals } from "./schema"
type GoalInsertResult = {
    id: string; // ou o tipo correto que você espera para o id
};
async function seed () {
    await db.delete(goalCompletions)
    await db.delete(goals)

    const result: GoalInsertResult[] = await db.insert(goals).values([
        {
            title:"acordar cedo",
            desiredWeeklyFrequency: 4,
        },
        {
            title:"assistir aula da rocket",
            desiredWeeklyFrequency: 2,
        },
        {
            title:"Trabalhar",
            desiredWeeklyFrequency: 1,
        },
        
    ]).returning()

        const startOfWeek = dayjs().startOf('week')

    await db.insert(goalCompletions).values([
        {
            goalId: result[0].id,
            createdAt: startOfWeek.toDate()
        },
        {
            goalId: result[1].id,
            createdAt: startOfWeek.add(1, 'day').toDate()
        },
        {
            goalId: result[2].id,
            createdAt: startOfWeek.add(1, 'week').toDate()
        },

    ])
}
seed().finally(() => {
    client.end()
})