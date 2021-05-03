export const stripe = {
    charges:{
        create:jest.fn().mockResolvedValue({})
    }
}

// we create the mock resole because the stripe object is returning a promise that
// is instantly resolved