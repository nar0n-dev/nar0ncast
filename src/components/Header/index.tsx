import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './styles.module.scss';

export const Header = () => {
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,
    });

    return (

        
        <header className={styles.headerContainer}>
            <img src="/nar0nlogo.png" alt="Nar0nCast Logo"/>
            <p>O melhor para você ouvir, sempre</p>
            <span>{currentDate}</span>
        </header>

        
    )
}