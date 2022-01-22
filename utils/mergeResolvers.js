export const mergeResolvers = (target, resolvers) => {
    const mergeObj = (origin, contentToMerge) => {
        for (let prop in contentToMerge) {
            if (!origin.hasOwnProperty(prop)) {
                origin[prop] = contentToMerge[prop];
            } else {
                mergeObj(origin[prop], contentToMerge[prop]);
            }
        }
    };
    resolvers.map((resolver) => {
        mergeObj(target, resolver);
    });
    return target;
};
/* 
    [
        {
            Query: {

            },
            Mutation: {

            }
        },
        {
            Query: {

            },
            Mutation: {

            }
        },
    ]

    {
        Query: {

        },
        Mutation: {

        }
    }
*/
