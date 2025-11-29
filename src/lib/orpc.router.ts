import { os } from '@orpc/server'
import z from 'zod'
import { lookupApp } from './app-store'

export const router = {
    app: {
        status: os.input(z.object({ appId: z.string(), region: z.string() })).handler(async ({ input }) => {
            const data = await lookupApp(input.appId, input.region);
            return data
        }),
    },
}