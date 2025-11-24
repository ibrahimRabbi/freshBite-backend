
export type Tsubscription = {
    plan: 'premium' | 'family' | 'guest' | 'trial',
    duration: 30 | 365 | 7,
    price: number,
    features: string[],
    isDeleted: boolean,
}