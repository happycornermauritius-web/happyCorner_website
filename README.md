# Happy Corner website

Website for Happy Corner, a Sino-Mauritian home kitchen: sakima, macaroni cake and Chinese roast.

- **frontend/**: Nuxt website. Customers see the menu, build an order and send it on WhatsApp. They can also read and post reviews.
- **backend/**: WordPress + WooCommerce, run locally with Docker. This is the admin side, where you manage the menu, prices, photos and reviews.

Customers don't need an account. Only the WordPress admin can change anything.

## 1. Preview the website (sample data)

Needs [Node.js 20+](https://nodejs.org).

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. A sample menu is shown until WooCommerce is connected.

## 2. Run WooCommerce on your computer

Needs [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
cd backend
cp .env.example .env        # then change the passwords in .env
docker compose up -d
docker compose run --rm setup
```

The setup step installs WordPress and WooCommerce and adds the starter menu. Run it once.
WordPress admin: http://localhost:8080/wp-admin (user and password from `.env`).

Then connect the website:

```bash
cd frontend
cp .env.example .env        # contains NUXT_PUBLIC_WP_URL=http://localhost:8080
npm run dev
```

## Managing the shop (WordPress admin)

| To do this                          | Go to                                         |
| ----------------------------------- | --------------------------------------------- |
| Add or edit dishes, prices, photos  | Products                                      |
| Mark a dish as sold out             | Products → edit → Inventory → Out of stock    |
| Change menu sections                | Products → Categories                         |
| Approve or delete reviews           | Products → Reviews                            |
| WhatsApp number, intro, hours, area | Settings → Happy Corner                       |

- The dish's **short description** is the line shown under its name.
- The **product image** is the round photo on the menu.
- New reviews are hidden until you approve them.
- The starter prices are placeholders.

## How ordering works

Orders don't go through WooCommerce checkout. The customer picks dishes, enters their name, chooses collect or delivery and presses **Send order on WhatsApp**. WhatsApp opens with the order written out, sent to the number in Settings → Happy Corner. You confirm the order and payment in the chat.

## How it fits together

- Menu, categories and approved reviews come from the **WooCommerce Store API** (`/wp-json/wc/store/v1/…`). It's public and read-only, so no API keys are needed in the website.
- `backend/mu-plugins/happy-corner.php` adds:
  - the **Settings → Happy Corner** page
  - `GET /wp-json/happy-corner/v1/settings` for the WhatsApp number and shop details
  - `POST /wp-json/happy-corner/v1/reviews`, which saves a review as pending. It has a spam trap and a one-per-minute limit.
  - permission for the website address(es) in Settings → Happy Corner to call the API (CORS)
- The website loads data in the browser, so changes in WordPress show on the next page load.

## Not online yet

Nothing here is deployed. When you're ready to launch:

- The Nuxt site can be built with `npm run generate` and hosted for free (GitHub Pages, Cloudflare Pages, Netlify).
- WordPress needs PHP hosting. Install WooCommerce there, copy `happy-corner.php` into `wp-content/mu-plugins/`, and add the live website address under Settings → Happy Corner.
