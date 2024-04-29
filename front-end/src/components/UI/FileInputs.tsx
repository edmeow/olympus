import {
    Control,
    Controller,
    FieldErrorsImpl,
    UseFormReset,
    UseFormSetValue,
    UseFormWatch,
} from 'react-hook-form';
import { IСreateContestRequest } from '../../models/request/IСreateContestRequest';
import { ChangeEvent } from 'react';

interface FileInputProps {
    control: Control<any>;
    watch: UseFormWatch<any>;
    setValue: UseFormSetValue<any>;
    reset: UseFormReset<any>;
    errors: Partial<FieldErrorsImpl<any>>;
}

const FileInputs: React.FC<FileInputProps> = ({
    errors,
    setValue,
    control,
    watch,
}) => {
    const { problemInfos } = watch();
    console.log(problemInfos);

    const validateFile = (v: any[]): boolean => {
        return false;
    };

    // const handleFileChange = async (file: File): Promise<string> => {
    //     return new Promise<string>((resolve, reject) => {
    //         const fileReader = new FileReader();

    //         fileReader.onload = () => {
    //             const fileString = fileReader.result as string;
    //             resolve(fileString);
    //         };

    //         fileReader.onerror = () => {
    //             reject(fileReader.error);
    //         };

    //         if (file) {
    //             fileReader.readAsText(file);
    //         } else {
    //             reject(new Error('No file provided'));
    //         }
    //     });
    // };
    const handleFileChange = async (files: File) => {
        const fileReader = new FileReader();
        let newproblems: string = '';

        if (files) {
            fileReader.readAsText(files);
            await new Promise<void>((resolve) => {
                fileReader.onloadend = () => {
                    if (fileReader.result) {
                        newproblems = fileReader.result.toString();
                    }
                    resolve();
                };
            });
        }
        return newproblems;
    };

    return (
        <>
            <Controller
                name="problems"
                control={control}
                defaultValue={[]}
                rules={{
                    required: { value: true, message: 'Обязательное поле' },
                    validate: (v) => validateFile(v),
                }}
                render={({ field: { value, name } }) => {
                    return (
                        <label className="adminForm__fileInput-custom">
                            <p>Добавить задание</p>

                            <input
                                className="adminForm__fileInput"
                                id="formId"
                                name={name}
                                type="file"
                                onChange={async (e) => {
                                    if (e.target) {
                                        if (e.target.files) {
                                            const newFile = e.target.files[0];
                                            setValue('problemInfos', [
                                                ...value,
                                                {
                                                    name: newFile.name,
                                                    problem:
                                                        await handleFileChange(
                                                            newFile,
                                                        ),
                                                    points: '0',
                                                },
                                            ]);
                                        }
                                    }
                                }}
                            />
                        </label>
                    );
                }}
            />
            {problemInfos
                ? problemInfos.map((item: any, index: number) => {
                      return (
                          <div>
                              <p>{item.name}</p>
                              <input
                                  value={item.points}
                                  onChange={(e) => {
                                      const newProblems = problemInfos;
                                      newProblems[index] = {
                                          ...newProblems[index],
                                          points: e.target.value,
                                      };
                                      setValue('problemsInfos', newProblems);
                                  }}
                                  placeholder="Введите количество баллов"
                              ></input>
                              <button
                                  onClick={() => {
                                      const newProblems = problemInfos;
                                      newProblems.splice(index, 1);
                                      setValue('problemsInfos', newProblems);
                                  }}
                              >
                                  Удалить
                              </button>
                          </div>
                      );
                  })
                : 'Нет заданий'}
        </>
    );
};

export default FileInputs;
