import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../hooks/useStore';
import AdminService from '../../../services/AdminService';
import Modal from '../../DeprecatedUI/Modal/Modal';
import { BaseFormModal } from '../../DeprecatedUI/BaseFormModal';
import { TextFieldFormComponent } from '../../DeprecatedUI/FormInputs/TextFieldFormComponent';

const RenameContestButton = () => {
  const { main } = useStore();
  const [isModalOpen, setModalOpen] = useState(false);

  const methods = useForm<{ name: string }>({
    defaultValues: { name: main.contest.name },
  });

  const handleRenameContest = async (data: { name: string }) => {
    setModalOpen(true);
    await AdminService.renameContest(main.contest.id, data.name);

    main.renameContest(data.name);
    setModalOpen(false);
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
