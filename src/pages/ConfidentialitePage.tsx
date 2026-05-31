import { Seo } from '@/app/Seo'

import { LegalArticle, LegalSection } from './legal/LegalArticle'

export function ConfidentialitePage() {
  return (
    <>
      <Seo
        title="Politique de confidentialité"
        description="Comment Parici traite (ou plutôt ne traite pas) vos données."
      />
      <LegalArticle title="Politique de confidentialité" updated="mai 2026">
        <p>
          Parici est conçu pour fonctionner <strong>sans collecter de données
          personnelles</strong>. Pas de compte, pas de profilage, pas de traceur
          publicitaire.
        </p>

        <LegalSection heading="Aucune donnée personnelle collectée">
          <p>
            L’application ne demande ni inscription, ni e-mail, ni information
            personnelle. Aucune donnée n’est envoyée à un serveur nous appartenant :
            les recherches sont adressées directement à l’API publique de la Ville
            de Paris.
          </p>
        </LegalSection>

        <LegalSection heading="Favoris : stockage local (localStorage)">
          <p>
            Lorsque vous ajoutez un événement à vos favoris, il est enregistré
            uniquement dans le <strong>stockage local de votre navigateur</strong>
            {' '}(clé <code>parici:favorites</code>). Ces données :
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>restent sur votre appareil et ne nous sont jamais transmises ;</li>
            <li>ne servent qu’à afficher votre liste de favoris ;</li>
            <li>
              peuvent être supprimées à tout moment en retirant vos favoris ou en
              vidant les données de site de votre navigateur.
            </li>
          </ul>
        </LegalSection>

        <LegalSection heading="Cookies">
          <p>
            Parici n’utilise <strong>aucun cookie</strong>, ni de mesure
            d’audience, ni de traceur tiers. Le stockage local utilisé pour les
            favoris est strictement fonctionnel et ne permet aucun suivi.
          </p>
        </LegalSection>

        <LegalSection heading="Hébergement et journaux techniques">
          <p>
            Le site est hébergé par Vercel, qui peut conserver des journaux
            techniques (adresse IP, type de navigateur) à des fins de sécurité et de
            fonctionnement, conformément à sa propre politique de confidentialité.
          </p>
        </LegalSection>

        <LegalSection heading="Vos droits">
          <p>
            Aucune donnée personnelle n’étant collectée par Parici, il n’y a rien à
            consulter, rectifier ou supprimer de notre côté. Pour toute question,
            vous pouvez écrire à{' '}
            <a
              href="mailto:hello@atelier21.org"
              className="font-medium text-navy underline decoration-coral decoration-2 underline-offset-2 hover:text-magenta-strong"
            >
              hello@atelier21.org
            </a>
            .
          </p>
        </LegalSection>
      </LegalArticle>
    </>
  )
}
