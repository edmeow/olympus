import React from 'react';

interface SetNamePageProps {}

const SetNamePage: React.FC<SetNamePageProps> = () => {
    return (
        <div>
            <form>
                <input placeholder="Введите свое имя"></input>
                <input placeholder="Введите свою фамилию"></input>
                <input placeholder="Введите своб почту"></input>
                <button>Запомнить</button>
            </form>
        </div>
    );
};

export default SetNamePage;
