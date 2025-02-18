# Mottled Moth Rocks

Static site for blog and music updates

## Prerequisites

[Install Ruby with chruby](https://mac.install.guide/ruby/12)

Basic command with homebrew
```
brew install chruby ruby-install xz
```

Jekyll tooling
```
gem install jekyll bundle
```

## Builds and run

```
# Install dependencies
bundle install

# Run site at localhost:4000
bundle exec jekyll serve

# Run site with draft posts
bundle exec jekyll serve --drafts
```

## Recommended Tooling

* [mdspell](https://github.com/mtuchowski/mdspell)

```
gem install mdspell
mdspell */**/*.md --config ./.mdspell.yml
```

Remove analytics when running locally

```
sed -i '' 's|<script data-goatcounter="https://mottled-moth-rocks.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>|<!-- <script data-goatcounter="https://mottled-moth-rocks.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script> -->|g' ./_layouts/*
```

Replace them before pushing

```
sed -i '' 's|<!-- <script data-goatcounter="https://mottled-moth-rocks.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script> -->|<script data-goatcounter="https://mottled-moth-rocks.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>|g' ./_layouts/*
```