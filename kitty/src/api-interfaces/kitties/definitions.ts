export default {
    types: {
        Address: "AccountId",
        LookupSource: "AccountId",
        KittyIndex: "u32",
        Kitty: "[u8; 16]"
    },
    rpc: {
        getKittyPrice:{
            description: 'Get Kitty price',
            params: [
                {
                    name: 'kittyIndex',
                    type: 'KittyIndex',
                    isHistoric: "bool",
                    isOptional: "bool"
                }
            ],
            type: 'Balance'
        }
    }
}
