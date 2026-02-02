import { Column, PrimaryGeneratedColumn } from "typeorm";

export enum Role{
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer'
}

export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique:true})
    username:string;

    @Column()
    firstName: string;

    @Column()
    lastName:string;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth:Date;

    @Column({default:false})
    isVerified:boolean;

    @Column({type:'enum', enum:Role, default:Role.VIEWER})
    role:Role;
}