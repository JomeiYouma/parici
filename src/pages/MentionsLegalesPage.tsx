import { Seo } from '@/app/Seo'

import { LegalArticle, LegalSection } from './legal/LegalArticle'

export function MentionsLegalesPage() {
  return (
    <>
      <Seo
        title="Mentions légales"
        description="Mentions légales de l’application Parici."
      />
      <LegalArticle title="Mentions légales" updated="mai 2026">
        <p>
          Parici est une application web de démonstration, non commerciale,
          permettant de consulter l’agenda culturel ouvert de la Ville de Paris.
        </p>

        <LegalSection heading="Éditeur">
          <p>
            Le présent site est édité par <strong>[Nom de l’éditeur]</strong>,
            dans le cadre d’un projet personnel / pédagogique.
            <br />
            Contact :{' '}
            <a
              href="mailto:hello@atelier21.org"
              className="font-medium text-navy underline decoration-coral decoration-2 underline-offset-2 hover:text-magenta-strong"
            >
              hello@atelier21.org
            </a>
          </p>
        </LegalSection>

        <LegalSection heading="Directeur de la publication">
          <p>[Nom du directeur de la publication].</p>
        </LegalSection>

        <LegalSection heading="Hébergeur">
          <p>
            Vercel Inc.
            <br />
            340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
            <br />
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-navy underline decoration-coral decoration-2 underline-offset-2 hover:text-magenta-strong"
            >
              vercel.com
            </a>
          </p>
        </LegalSection>

        <LegalSection heading="Données affichées">
          <p>
            Les événements proviennent du jeu de données{' '}
            <a
              href="https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-navy underline decoration-coral decoration-2 underline-offset-2 hover:text-magenta-strong"
            >
              « Que faire à Paris ? »
            </a>{' '}
            publié par la Ville de Paris sous licence ODbL. Parici n’est pas
            affilié à la Ville de Paris. Les contenus (titres, descriptions,
            images) restent la propriété de leurs auteurs respectifs.
          </p>
        </LegalSection>

        <LegalSection heading="Propriété intellectuelle">
          <p>
            Le code source et le design de l’application sont publiés sous licence
            MIT. La réutilisation des données est soumise à la licence ODbL de la
            source.
          </p>
        </LegalSection>

        <LegalSection heading="Responsabilité">
          <p>
            Les informations sur les événements sont fournies « en l’état » par la
            source open data. Parici ne saurait être tenu responsable d’éventuelles
            inexactitudes, modifications ou annulations. Vérifiez toujours
            l’information sur la fiche officielle de l’événement.
          </p>
        </LegalSection>
      </LegalArticle>
    </>
  )
}
