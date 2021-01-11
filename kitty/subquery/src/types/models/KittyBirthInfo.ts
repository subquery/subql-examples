// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT
import {Entity} from "@subql/types";
import assert from 'assert';
import BN from 'bn.js'


export class KittyBirthInfo implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public birthBlockHeight: BigInt;

    public owner: string;

    public firstOwner: string;

    public parent1?: string;

    public parent2?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save KittyBirthInfo entity without an ID");
        store.set('KittyBirthInfo', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove KittyBirthInfo entity without an ID");
        await store.remove('KittyBirthInfo', id.toString());
    }

    static async get(id:string): Promise<KittyBirthInfo>{
        assert(id !== null, "Cannot get KittyBirthInfo entity without an ID");
        const record = await store.get('KittyBirthInfo', id.toString());
        return KittyBirthInfo.create(record);
    }

    static create(record){
        let entity = new KittyBirthInfo(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
