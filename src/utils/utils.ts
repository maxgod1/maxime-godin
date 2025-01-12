import { env } from "../../env.mjs";
import { clsx, type ClassValue } from 'clsx'

import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getStaticImgUrl = (path: string) =>
    `${env.NEXT_PUBLIC_STATIC_IMG_URL}/${path}`