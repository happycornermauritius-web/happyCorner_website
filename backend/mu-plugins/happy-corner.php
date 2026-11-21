<?php
/**
 * Plugin Name: Happy Corner
 * Description: Settings page (WhatsApp number, intro, hours) and the API the Nuxt website uses for shop details and customer reviews.
 * Version:     1.0.0
 *
 * Must-use plugin: copy this file to wp-content/mu-plugins/.
 */

defined( 'ABSPATH' ) || exit;

const HAPPY_CORNER_OPTION = 'happy_corner_settings';

function happy_corner_defaults(): array {
	return array(
		'whatsapp'     => '',
		'intro'        => '',
		'about'        => '',
		'location'     => '',
		'hours'        => '',
		'deliveryNote' => '',
		'facebook'     => '',
		'instagram'    => '',
		'origins'      => 'http://localhost:3000',
	);
}

function happy_corner_settings(): array {
	$saved = get_option( HAPPY_CORNER_OPTION, array() );
	return array_merge( happy_corner_defaults(), is_array( $saved ) ? $saved : array() );
}

/* -------------------------------------------------------------------------
 * Settings → Happy Corner
 * ---------------------------------------------------------------------- */

add_action( 'admin_menu', function () {
	add_options_page( 'Happy Corner', 'Happy Corner', 'manage_options', 'happy-corner', 'happy_corner_render_settings' );
} );

add_action( 'admin_init', function () {
	register_setting(
		'happy_corner',
		HAPPY_CORNER_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'happy_corner_sanitize',
			'default'           => happy_corner_defaults(),
		)
	);
} );

function happy_corner_sanitize( $input ): array {
	$input = is_array( $input ) ? $input : array();
	$out   = happy_corner_defaults();

	$out['whatsapp']     = preg_replace( '/[^\d+]/', '', (string) ( $input['whatsapp'] ?? '' ) );
	$out['intro']        = sanitize_textarea_field( $input['intro'] ?? '' );
	$out['about']        = sanitize_textarea_field( $input['about'] ?? '' );
	$out['location']     = sanitize_text_field( $input['location'] ?? '' );
	$out['hours']        = sanitize_text_field( $input['hours'] ?? '' );
	$out['deliveryNote'] = sanitize_text_field( $input['deliveryNote'] ?? '' );
	$out['facebook']     = esc_url_raw( $input['facebook'] ?? '' );
	$out['instagram']    = esc_url_raw( $input['instagram'] ?? '' );

	$origins = array_filter(
		array_map(
			fn( $o ) => untrailingslashit( esc_url_raw( trim( $o ) ) ),
			preg_split( '/[\s,]+/', (string) ( $input['origins'] ?? '' ) )
		)
	);
	$out['origins'] = implode( "\n", $origins );

	return $out;
}

function happy_corner_render_settings(): void {
	$s      = happy_corner_settings();
	$name   = HAPPY_CORNER_OPTION;
	$fields = array(
		'whatsapp'     => array( 'WhatsApp number', 'text', 'Orders are sent here. Mauritius numbers can be written as 5XXX XXXX.' ),
		'intro'        => array( 'Intro text', 'textarea', 'Shown under the main heading on the home page.' ),
		'about'        => array( 'About Happy Corner', 'textarea', 'Your story, shown on the home page. Leave a blank line between paragraphs.' ),
		'location'     => array( 'Area', 'text', 'For example: Port Louis. Leave empty to hide.' ),
		'hours'        => array( 'Opening hours', 'text', 'For example: Order Tue–Sat, collect from 10:00. Leave empty to hide.' ),
		'deliveryNote' => array( 'Ordering note', 'text', 'Shown at the top of the menu, for example delivery areas or how far ahead to order.' ),
		'facebook'     => array( 'Facebook page link', 'url', '' ),
		'instagram'    => array( 'Instagram link', 'url', '' ),
		'origins'      => array( 'Website address', 'textarea', 'Address of the Nuxt website, one per line. Only these can load the menu and post reviews.' ),
	);
	?>
	<div class="wrap">
		<h1>Happy Corner</h1>
		<p>Menu items, prices and photos are managed under <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=product' ) ); ?>">Products</a>. Use square (1:1) photos. Tick the star in the product list to show a dish under Favourites on the home page. New reviews wait for your approval under <a href="<?php echo esc_url( admin_url( 'edit.php?post_type=product&page=product-reviews' ) ); ?>">Products → Reviews</a>.</p>
		<form method="post" action="options.php">
			<?php settings_fields( 'happy_corner' ); ?>
			<table class="form-table" role="presentation">
				<?php foreach ( $fields as $key => [ $label, $type, $help ] ) : ?>
					<tr>
						<th scope="row"><label for="hc-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></label></th>
						<td>
							<?php if ( 'textarea' === $type ) : ?>
								<textarea class="large-text" rows="3" id="hc-<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( "{$name}[{$key}]" ); ?>"><?php echo esc_textarea( $s[ $key ] ); ?></textarea>
							<?php else : ?>
								<input class="regular-text" type="<?php echo esc_attr( $type ); ?>" id="hc-<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( "{$name}[{$key}]" ); ?>" value="<?php echo esc_attr( $s[ $key ] ); ?>">
							<?php endif; ?>
							<?php if ( $help ) : ?>
								<p class="description"><?php echo esc_html( $help ); ?></p>
							<?php endif; ?>
						</td>
					</tr>
				<?php endforeach; ?>
			</table>
			<?php submit_button( 'Save settings' ); ?>
		</form>
	</div>
	<?php
}

/* -------------------------------------------------------------------------
 * Let the Nuxt website call the WordPress API from the browser (CORS)
 * ---------------------------------------------------------------------- */

function happy_corner_origins(): array {
	return array_filter( array_map( 'trim', explode( "\n", happy_corner_settings()['origins'] ) ) );
}

add_filter( 'allowed_http_origins', fn( $origins ) => array_merge( (array) $origins, happy_corner_origins() ) );

add_filter(
	'rest_pre_serve_request',
	function ( $served ) {
		$origin = get_http_origin();
		if ( $origin && in_array( untrailingslashit( $origin ), happy_corner_origins(), true ) ) {
			header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
			header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
			header( 'Access-Control-Allow-Headers: Content-Type' );
			header( 'Vary: Origin', false );
		}
		return $served;
	},
	20
);

/* -------------------------------------------------------------------------
 * API: GET  /wp-json/happy-corner/v1/settings
 *      POST /wp-json/happy-corner/v1/reviews
 * Menu and approved reviews come from the WooCommerce Store API.
 * ---------------------------------------------------------------------- */

add_action( 'rest_api_init', function () {
	register_rest_route(
		'happy-corner/v1',
		'/settings',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => function () {
				$s = happy_corner_settings();
				unset( $s['origins'] );
				return rest_ensure_response( $s );
			},
		)
	);

	register_rest_route(
		'happy-corner/v1',
		'/reviews',
		array(
			'methods'             => 'POST',
			'permission_callback' => '__return_true',
			'callback'            => 'happy_corner_create_review',
			'args'                => array(
				'product_id' => array( 'type' => 'integer', 'required' => true ),
				'reviewer'   => array( 'type' => 'string', 'required' => true ),
				'email'      => array( 'type' => 'string', 'default' => '' ),
				'rating'     => array( 'type' => 'integer', 'required' => true ),
				'review'     => array( 'type' => 'string', 'required' => true ),
				'website'    => array( 'type' => 'string', 'default' => '' ),
			),
		)
	);
} );

function happy_corner_error( string $code, string $message, int $status = 400 ): WP_Error {
	return new WP_Error( $code, $message, array( 'status' => $status ) );
}

function happy_corner_create_review( WP_REST_Request $req ) {
	// Spam trap: people never see this field, bots fill it in. Pretend it worked.
	if ( '' !== trim( (string) $req['website'] ) ) {
		return new WP_REST_Response( array( 'status' => 'pending' ), 201 );
	}

	$ip  = sanitize_text_field( $_SERVER['REMOTE_ADDR'] ?? '' );
	$key = 'hc_review_' . md5( $ip );
	if ( get_transient( $key ) ) {
		return happy_corner_error( 'too_fast', 'Please wait a minute before posting another review.', 429 );
	}

	$product_id = (int) $req['product_id'];
	$product    = function_exists( 'wc_get_product' ) ? wc_get_product( $product_id ) : null;
	if ( ! $product || 'publish' !== $product->get_status() ) {
		return happy_corner_error( 'bad_product', 'Choose a dish from the menu.' );
	}
	if ( 'yes' !== get_option( 'woocommerce_enable_reviews', 'yes' ) || ! comments_open( $product_id ) ) {
		return happy_corner_error( 'closed', 'Reviews are closed for this dish.', 403 );
	}

	$reviewer = trim( sanitize_text_field( $req['reviewer'] ) );
	$email    = sanitize_email( $req['email'] );
	$rating   = (int) $req['rating'];
	$text     = trim( sanitize_textarea_field( $req['review'] ) );

	if ( '' === $reviewer || mb_strlen( $reviewer ) > 60 ) {
		return happy_corner_error( 'bad_name', 'Enter your name (up to 60 characters).' );
	}
	if ( $rating < 1 || $rating > 5 ) {
		return happy_corner_error( 'bad_rating', 'Choose a rating from 1 to 5 stars.' );
	}
	if ( mb_strlen( $text ) < 3 || mb_strlen( $text ) > 1000 ) {
		return happy_corner_error( 'bad_review', 'Write between 3 and 1000 characters.' );
	}

	$comment_id = wp_insert_comment(
		array(
			'comment_post_ID'      => $product_id,
			'comment_author'       => $reviewer,
			'comment_author_email' => $email,
			'comment_author_IP'    => $ip,
			'comment_agent'        => substr( sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] ?? '' ), 0, 254 ),
			'comment_content'      => $text,
			'comment_type'         => 'review',
			'comment_approved'     => 0, // always wait for approval
			'comment_meta'         => array(
				'rating'   => $rating,
				'verified' => 0,
			),
		)
	);

	if ( ! $comment_id ) {
		return happy_corner_error( 'save_failed', 'Your review couldn’t be saved. Try again later.', 500 );
	}

	set_transient( $key, 1, MINUTE_IN_SECONDS );
	wp_notify_moderator( $comment_id );

	return new WP_REST_Response( array( 'status' => 'pending' ), 201 );
}
