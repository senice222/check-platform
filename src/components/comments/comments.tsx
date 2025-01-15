import React, { FC, useState, useEffect, useRef } from 'react'
import { Message, AttachFile, SendSvg, FileXlss, Trash, Close } from '../svgs/svgs'
import s from './comments.module.scss'
import Button from '../ui/button/button'
import ClearComments from '../modals/clear-comments/clear-comments'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { 
    fetchComments, 
    addComment, 
    deleteComment, 
    clearComments,
    commentActions 
} from '../../store/slices/commentSlice'
import { useNotification } from '../../contexts/NotificationContext/NotificationContext'
import { formatDate } from '../../utils/date'

interface Props {
    editing: boolean;
    applicationId: string;
}

interface FileI {
    originalName: string;
    path: string;
    mimetype: string;
}

interface CommentProps {
    id: string;
    author: string;
    createdAt: string;
    text: string;
    file?: FileI;
    onDelete?: (id: string) => void;
}

const CommentMessage: FC<CommentProps> = ({ id, author, createdAt, text, file, onDelete }) => {
    const getFileIcon = (mimetype: string) => {
        switch (mimetype) {
            case 'application/pdf':
                return <FileXlss style={{ fill: '#E6483D' }} />; // Красный для PDF
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return <FileXlss style={{ fill: '#2B579A' }} />; // Синий для Word
            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return <FileXlss style={{ fill: '#217346' }} />; // Зеленый для Excel
            case 'image/jpeg':
            case 'image/png':
                return <FileXlss style={{ fill: '#924FE8' }} />; // Фиолетовый для изображений
            default:
                return <FileXlss />; // Стандартная иконка
        }
    };

    const handleDownload = async () => {
        if (!file?.path) return;
        
        try {
            const response = await fetch(file.path);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.originalName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className={s.commentMessage}>
            <div className={s.avatar}>{author[0]}</div>
            <div className={s.rightDiv}>
                <div className={s.header}>
                    <div className={s.messageInfo}>
                        <h1 className={s.name}>{author}</h1>
                        <p className={s.date}>{formatDate(new Date(createdAt))}</p>
                        {onDelete && (
                            <button 
                                className={s.deleteBtn} 
                                onClick={() => onDelete(id)}
                            >
                                <Trash />
                            </button>
                        )}
                    </div>
                    <p className={s.text}>{text}</p>
                    {file && (
                        <div className={s.files}>
                            <div className={s.file}>
                                {getFileIcon(file.mimetype)}
                                <div className={s.rightInfo}>
                                    <p className={s.fileName}>{file.originalName}</p>
                                    <p className={s.download} onClick={handleDownload}>
                                        Скачать
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Comments: FC<Props> = ({ editing, applicationId }) => {
    const dispatch = useAppDispatch();
    const { addNotification } = useNotification();
    const { comments, isLoading } = useAppSelector(state => state.comment);
    const [isOpened, setOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [clearingTimeout, setClearingTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (applicationId) {
            dispatch(fetchComments(applicationId))
                .unwrap()
                .catch(error => {
                    addNotification(error.message || 'Ошибка при загрузке комментариев', 'error');
                });
        }
    }, [applicationId]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                addNotification('Файл слишком большой. Максимальный размер 5MB', 'error');
                return;
            }

            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/jpeg',
                'image/png'
            ];

            if (!allowedTypes.includes(file.type)) {
                addNotification('Неподдерживаемый тип файла', 'error');
                return;
            }

            setSelectedFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!commentText.trim() && !selectedFile) return;

        try {
            const formData = new FormData();
            formData.append('applicationId', applicationId);
            formData.append('text', commentText);
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            await dispatch(addComment(formData)).unwrap();

            setCommentText('');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            addNotification(error.message || 'Ошибка при добавлении комментария', 'error');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await dispatch(deleteComment(commentId)).unwrap();
            addNotification('Комментарий удален', 'success');
        } catch (error: any) {
            addNotification(error.message || 'Ошибка при удалении комментария', 'error');
        }
    };

    const handleClearComments = async () => {
        try {
            // Сначала очищаем локально
            dispatch(commentActions.clearCommentsLocally());
            setOpen(false);

            // Показываем уведомление с возможностью отмены
            addNotification("Комментарии успешно очищены", "success", () => {
                // При отмене восстанавливаем комментарии и очищаем таймер
                if (clearingTimeout) {
                    clearTimeout(clearingTimeout);
                    setClearingTimeout(null);
                }
                dispatch(commentActions.restoreComments());
            });

            // Устанавливаем таймер для отправки запроса
            const timeoutId = setTimeout(async () => {
                try {
                    await dispatch(clearComments(applicationId)).unwrap();
                    setClearingTimeout(null);
                } catch (error: any) {
                    dispatch(commentActions.restoreComments());
                    addNotification(error.message || 'Ошибка при очистке комментариев', 'error');
                }
            }, 3000);

            setClearingTimeout(timeoutId);

        } catch (error: any) {
            dispatch(commentActions.restoreComments());
            addNotification(error.message || 'Ошибка при очистке комментариев', 'error');
        }
    };

    // Очищаем таймер при размонтировании компонента
    useEffect(() => {
        return () => {
            if (clearingTimeout) {
                clearTimeout(clearingTimeout);
            }
        };
    }, [clearingTimeout]);

    return (
        <>
            <ClearComments 
                isOpened={isOpened} 
                setOpen={setOpen} 
                onConfirm={handleClearComments}
            />
            <div className={`${s.comments} ${editing ? s.hiddenComments : ""}`}>
                <div className={s.titleDiv}>
                    <div>
                        <h2>Комментарии по заявке</h2>
                        <p>Видны только администраторам</p>
                    </div>
                    {comments.length > 0 && (
                        <Button 
                            onClick={() => setOpen(true)} 
                            styleLabel={{ marginTop: 0, color: '#14151A', fontSize: '14px', fontWeight: '500' }} 
                            style={{ width: '112px', height: '32px' }} 
                            label='Очистить' 
                            icon={<Trash />} 
                            variant='white' 
                        />
                    )}
                </div>
                
                {isLoading ? (
                    <div className={s.loading}>Загрузка...</div>
                ) : comments.length === 0 ? (
                    <div className={s.nothingFound}>
                        <Message />
                        <p>Пока что комментариев нет</p>
                    </div>
                ) : (
                    <div className={s.commentsList}>
                        {comments.map(comment => (
                            <CommentMessage 
                                key={comment.id} 
                                {...comment}
                                onDelete={handleDeleteComment}
                            />
                        ))}
                    </div>
                )}

                <div className={s.inputContainer}>
                    <div className={s.attachDiv} onClick={() => fileInputRef.current?.click()}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        />
                        <AttachFile />
                        {selectedFile && (
                            <div className={s.attachedFile}>
                                <span className={s.fileName}>{selectedFile.name}</span>
                                <span className={s.removeFile} onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }}>
                                    <Trash />
                                </span>
                            </div>
                        )}
                    </div>
                    <div className={s.inputDiv}>
                        <input
                            type="text"
                            placeholder="Написать комментарий"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                        <div 
                            className={`${s.send} ${(!commentText.trim() && !selectedFile) ? s.disabled : ''}`}
                            onClick={handleSubmit}
                        >
                            <SendSvg />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Comments;