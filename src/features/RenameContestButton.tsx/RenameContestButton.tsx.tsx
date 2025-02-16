import { useEffect, useState } from 'react';
import { useApiHook } from '../../hooks/useApiHook';
import AdminService from '../../services/AdminService';
import { useForm } from 'react-hook-form';
import { TextFieldFormComponent } from '../../components/UI/FormInputs/TextFieldFormComponent';
import { BaseFormModal } from '../../components/UI/BaseFormModal';
import Modal from '../../components/UI/Modal/Modal';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';

const RenameContestButton = () => {
    const { main } = useStore();
    const [isModalOpen, setModalOpen] = useState(false);

    const { handleRequest: renameContest } = useApiHook({
        resolveMessage: 'Имя олимпиады успешно обновлено',
    });

    const methods = useForm<{ name: string }>({
        defaultValues: { name: main.contest.name },
    });

    const handleRenameContest = async (data: { name: string }) => {
        setModalOpen(true);
        const resp = await renameContest(() =>
            AdminService.renameContest(main.contest.session, data.name),
        );

        if (resp) {
            main.renameContest(data.name);
            setModalOpen(false);
        }
    };

    const handleButtonClick = async () => {
        setModalOpen(true);
    };
    useEffect(() => {
        methods.reset({ name: main.contest.name });
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
