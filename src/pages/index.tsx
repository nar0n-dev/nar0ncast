import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/apis'
import { ConvertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import { usePlayer } from '../contexts/PlayerContext';


type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
  duration: number;
  durationAsString: string;
}

type HomeProps = {
  lastestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({lastestEpisodes, allEpisodes} : HomeProps) {
  const { playList } = usePlayer();
  const episodeList = [...lastestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Nar0nCast</title>
      </Head>
      <section className={styles.lastestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
        {lastestEpisodes.map((ep, index) => {
          return(
            <li key={ep.id}>
              <Image width={192} height={192} objectFit="cover" src={ep.thumbnail} alt={ep.title}/>
              <div className={styles.episodeDetails}>
                <Link href={`episode/${ep.id}`}>
                  <a>{ep.title}</a>
                </Link>
                <p>{ep.members}</p>
                <span>{ep.publishedAt}</span>
                <span>{ep.durationAsString}</span>
              </div>
              <button onClick={() => playList(episodeList, index)}>
                <img src="/play-green.svg" alt="Tocar episódio"/>
              </button>
            </li>
          );
        })}  
        </ul>
      </section>
      
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>PodCast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((ep, index) => {
              return (
                <tr key={ep.id}>
                  <td style={{width: 72}}>
                    <Image width={120} height={120} src={ep.thumbnail} alt={ep.title} objectFit="cover"/>
                  </td>
                  <td>
                    <Link href={`episode/${ep.id}`}>
                      <a>{ep.title}</a>
                    </Link>
                  </td>
                  
                  <td>{ep.members}</td>
                  <td style={{width: 100}}>{ep.publishedAt}</td>
                  <td>{ep.durationAsString}</td>
                  <td>
                    <button type='button' onClick={() => playList(episodeList, index + lastestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button> 
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'dd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration), 
      durationAsString: ConvertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  })

  const lastestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      lastestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}

function episode(episode: any): void {
  throw new Error('Function not implemented.');
}
