import React, { FC, useState } from 'react'
import { Message, AttachFile, SendSvg, FileXlss, Trash } from '../svgs/svgs'
import s from './comments.module.scss'
import Button from '../ui/button/button'
import ClearComments from '../modals/clear-comments/clear-comments'

interface Props {
    editing: boolean
}

interface FileI {
    fileUrl: string,
    type: string,
    fileName: string
}

interface CommentProps {
    name: string,
    date: string, // 08/10/24 в 10:04
    text: string,
    files: FileI[],
}
const comments: CommentProps[] = [
    {
        name: "John Doe",
        date: "08/10/24 в 10:04",
        text: "This is a sample comment with some files attached.",
        files: [
            {
                fileUrl: "https://example.com/file1.pdf",
                type: "pdf",
                fileName: "file1.pdf",
            },
            {
                fileUrl: "https://example.com/image1.png",
                type: "image",
                fileName: "image1.png",
            },
        ],
    },
    {
        name: "Jane Smith",
        date: "09/10/24 в 14:22",
        text: "Here's another comment, this one has no files.",
        files: [],
    },
    {
        name: "Michael Brown",
        date: "10/10/24 в 09:15",
        text: "Check out the attached documents for more details.",
        files: [
            {
                fileUrl: "https://example.com/document1.docx",
                type: "docx",
                fileName: "document1.docx",
            },
            {
                fileUrl: "https://example.com/presentation1.pptx",
                type: "pptx",
                fileName: "presentation1.pptx",
            },
        ],
    },
    {
        name: "Emily Johnson",
        date: "11/10/24 в 18:45",
        text: "Great discussion so far. Here's a related image.",
        files: [
            {
                fileUrl: "https://example.com/image2.jpg",
                type: "image",
                fileName: "image2.jpg",
            },
        ],
    },
];

const CommentMessage: FC<CommentProps> = ({ name, date, text, files }) => {
    return (
        <div className={s.commentMessage}>
            <div className={s.avatar}>{name.split('')[0]}</div>
            <div className={s.rightDiv}>
                <div className={s.header}>
                    <div className={s.messageInfo}>
                        <h1 className={s.name}>{name}</h1>
                        <p className={s.date}>{date}</p>
                    </div>
                    <p className={s.text}>{text}</p>
                    <div className={s.files}>
                        {files.map((file, index) => (
                            <div key={index} className={s.file}>
                                <FileXlss />
                                <div className={s.rightInfo}>
                                    <p className={s.fileName}>{file.fileName}</p>
                                    <p className={s.download}>Скачать</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const Comments: FC<Props> = ({ editing }) => {
    const [isOpened, setOpen] = useState(false)
    return (
        <>
            <ClearComments isOpened={isOpened} setOpen={setOpen} />
            <div className={`${s.comments} ${editing ? s.hiddenComments : ""}`}>
                <div className={s.titleDiv}>
                    <div>
                        <h2>Комментарии по заявке</h2>
                        <p>Видны только администраторам</p>
                    </div>
                    {comments.length !== 0 && <Button onClick={() => setOpen(true)} styleLabel={{ marginTop: 0, color: '#14151A', fontSize: '14px', fontWeight: '500' }} style={{ width: '112px', height: '32px' }} label='Очистить' icon={<Trash />} variant='white' />
                    }
                </div>
                {comments.length === 0 ? <div className={s.nothingFound}>
                    <Message />
                    <p>Пока что комментариев нет</p>
                </div> : <div className={s.commentsList}>
                    {comments.map((comment, index) => <CommentMessage key={index} {...comment} />)}
                </div>}
                <div className={s.inputContainer}>
                    <div className={s.attachDiv}>
                        <AttachFile />
                    </div>
                    <div className={s.inputDiv}>
                        <input type="text" placeholder="Написать комментарий" />
                        <div className={s.send}>
                            <SendSvg />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Comments