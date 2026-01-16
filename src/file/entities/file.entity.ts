import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class File{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    publicId:string

    @Column()
    url:string

    @Column()
    originalName:string

    @Column()
    resourceType:string

    @Column()
    mimeType:string

    @Column('int')
    size:number

    @CreateDateColumn()
    createdAt:Date

    @CreateDateColumn()
    updatedAt:Date

    //TO DO: Integrating with the soon to be created user entity
    //@Column({ nullable:true })
    //uploadedBy:string
}