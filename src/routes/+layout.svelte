<script>
    import '@picocss/pico';
    import '$lib/css/global.css';
</script>

<header>
    <!--This is where a navbar should go-->
    <nav>
        <ul>
          <li><a href="/" class="contrast"><strong>dss-blog</strong></a></li>
          <!---->
          <li><a href="/posts">Posts</a></li>
          <li><a href="/search">Search</a></li>
        </ul>
        <ul>
          <!--TODO: display user menu if user is logged in already-->
          <li><a href="/auth/login" role="button">Log in</a></li>
          <li><a href="/auth/register" role="button" class="secondary">Register</a></li>
        </ul>
      </nav>
      <hr />
</header>

<!--
    <slot> is a special element which puts any content provided when calling a component inside it.
    In the context of a layout file, this is where the page contents is inserted.
-->
<slot></slot>

<footer>
    <!--This is where you would put the footer-->
    <hr />
    <small>Copyright &copy; 2023 Jack Mawer, Jen Katuwal, Charis Stanley</small>
</footer>


<style>
    header,
    footer {
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        padding: 0 var(--block-spacing-horizontal);
    }

    footer {
        padding-top: 1rem;
    }

    footer > small {
        color: var(--muted-color);
    }
</style>