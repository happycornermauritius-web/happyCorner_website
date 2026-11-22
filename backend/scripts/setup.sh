#!/bin/sh
# Installs WordPress + WooCommerce and creates the Happy Corner starter menu.
# Safe to run more than once: existing products and categories are kept.
set -e

echo "Waiting for WordPress files..."
i=0
until [ -f /var/www/html/wp-config.php ]; do
  i=$((i + 1))
  [ "$i" -gt 60 ] && { echo "WordPress didn't start. Run: docker compose up -d"; exit 1; }
  sleep 2
done

if ! wp core is-installed 2>/dev/null; then
  echo "Installing WordPress..."
  wp core install \
    --url="$WP_URL" \
    --title="Happy Corner" \
    --admin_user="$WP_ADMIN_USER" \
    --admin_password="$WP_ADMIN_PASSWORD" \
    --admin_email="$WP_ADMIN_EMAIL" \
    --skip-email
fi

wp rewrite structure '/%postname%/' --hard >/dev/null

if ! wp plugin is-installed woocommerce; then
  echo "Installing WooCommerce..."
  wp plugin install woocommerce
fi
wp plugin activate woocommerce

echo "Configuring the shop..."
wp option update woocommerce_default_country "MU" >/dev/null
wp option update woocommerce_currency "MUR" >/dev/null
wp option update woocommerce_price_num_decimals 0 >/dev/null
wp option update woocommerce_enable_reviews yes >/dev/null
wp option update woocommerce_enable_review_rating yes >/dev/null
wp option update woocommerce_review_rating_required yes >/dev/null
wp option update woocommerce_review_rating_verification_required no >/dev/null
wp option update woocommerce_coming_soon no >/dev/null
wp option update comment_moderation 1 >/dev/null

# Website settings (only if not set yet)
if ! wp option get happy_corner_settings >/dev/null 2>&1; then
  wp option add happy_corner_settings --format=json \
    "{\"whatsapp\":\"\",\"intro\":\"\",\"about\":\"\",\"location\":\"\",\"hours\":\"\",\"deliveryNote\":\"\",\"deliveryPoints\":\"\",\"homeDeliveryMin\":4500,\"facebook\":\"\",\"instagram\":\"https://www.instagram.com/happycorner.mu/\",\"origins\":\"$SITE_URL\"}"
fi

category() { # slug name description -> prints term id
  id=$(wp term list product_cat --slug="$1" --field=term_id)
  [ -z "$id" ] && id=$(wp term create product_cat "$2" --slug="$1" --description="$3" --porcelain)
  echo "$id"
}

product() { # slug name price category_id short_description featured
  if [ -z "$(wp post list --post_type=product --name="$1" --post_status=any --field=ID)" ]; then
    wp wc product create --user="$WP_ADMIN_USER" \
      --name="$2" --slug="$1" --type=simple --status=publish \
      --regular_price="$3" \
      --categories="[{\"id\":$4}]" \
      --short_description="$5" \
      --reviews_allowed=true \
      --featured="${6:-false}" \
      --porcelain >/dev/null
    echo "  added $2"
  fi
}

echo "Creating the menu..."
# Descriptions are placeholders: change them under Products -> Categories.
SWEETS=$(category sakima-macaroni-cake "Sakima & macaroni cake" "Sweet treats for tea time and gatherings.")
ROAST=$(category chinese-roast "Chinese roast" "Roast meats in the Sino-Mauritian style.")

# Prices are placeholders: change them in WordPress under Products.
product sakima          "Sakima"          150 "$SWEETS" "Crisp fried pastry bound with honey syrup, cut into squares." true
product macaroni-cake   "Macaroni cake"   200 "$SWEETS" ""
product grilled-sausage "Grilled sausage" 250 "$ROAST"  "Chinese sausage, grilled."
product porc-chasive    "Porc chasive"    350 "$ROAST"  "Pork roasted in a sweet, glossy chasive glaze." true
product chicken-chasive "Chicken chasive" 300 "$ROAST"  "Chicken roasted in the same chasive glaze."

echo ""
echo "Done. WordPress admin: $WP_URL/wp-admin  (user: $WP_ADMIN_USER)"
echo "Next: set your WhatsApp number under Settings -> Happy Corner."
