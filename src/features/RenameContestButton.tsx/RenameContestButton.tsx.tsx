import { useContext, useEffect, useState } from 'react';
import { Context } from '../..';
import { useApiHook } from '../../hooks/useApiHook';
import AdminService from '../../services/AdminService';
import { useForm } from 'react-hook-form';
import { TextFieldFormComponent } from '../../components/UI/FormInputs/TextFieldFormComponent';
import { BaseFormModal } from '../../components/UI/BaseFormModal';
import Modal from '../../components/UI/Modal/Modal';
import { observer } from 'mobx-react-lite';

const RenameContestButton = () => {
    const { store } = useContext(Context);
    const [isModalOpen, setModalOpen] = useState(false);

    const { handleRequest: renameContest } = useApiHook({
        resolveMessage: 'Имя олимпиады успешно обновлено',
    });

    const methods = useForm<{ name: string }>({
        defaultValues: { name: store.contest.name },
    });

    const handleRenameContest = async (data: { name: string }) => {
        setModalOpen(true);
        const resp = await renameContest(() =>
            AdminService.renameContest(store.contest.session, data.name),
        );

        if (resp) {
            store.renameContest(data.name);
            setModalOpen(false);
        }
    };

    const handleButtonClick = async () => {
        setModalOpen(true);
    };
    useEffect(() => {
        methods.reset({ name: store.contest.name });
    }, [isModalOpen]);
    return (
        <>
            <button
                className="contest-header__edit-btn"
                onClick={handleButtonClick}
            />
            <Modal active={isModalOpen} setActive={setModalOpen}>
                <BaseFormModal
                    methods={methods}
                    active={isModalOpen}
                    title={'Сохранить'}
                    onSubmit={handleRenameContest}
                    content={
                        <TextFieldFormComponent
                            fullWidth
                            name={'name'}
                            label={'Новое имя олимпиады'}
                        />
                    }
                />
            </Modal>
        </>
    );
};

export default observer(RenameContestButton);
