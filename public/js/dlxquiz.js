/*!
 * name    : dlxQuiz jQuery Plugin
 * author  : Chyno Deluxe
 * version : 1.0.0
 *
 * copyright (c) 2016 Chyno Deluxe - http://www.chynodeluxe.com
 * license MIT
 */

( function ( $ ) {
  "use strict";
  $.dlxQuiz = function ( element, options ) {
    var plugin = this,
      $element = $( element ),
      _element_id = $element.attr( 'id' ),
      _element = '#' + _element_id,

      /*----------------------------
          Quiz JSON Data
      ----------------------------*/
      question_index = 0,
      quizData = options.quizData,
      //will be populated after json data is parsed
      questions = null,
      questionCount = null,

      /*----------------------------
          Defaults
       ---------------------------*/
      defaults = {

        /* Text
         ---------------------------*/
        questionCount_text: "Вопрос %current_index из %totalQuestions",
        backButton_text: "Предыдущий вопрос",
        nextButton_text: "Следующий вопрос",
        completeButton_text: "Завершить",
        viewResultsButton_text: "Посмотреть результаты",
        resultsHeader_text: "Ваши результаты.",
        quizScore_text: "Вы ответили на %totalScore из %totalQuestions вопросов.",
        quizScoreMessage_text: "",
        quizScoreRank_text: {
          a: "Отличный результат!",
          b: "Хорошая работа!",
          c: "Как минимум, вы прошли тест)).",
          d: "Вам стоит лучше знать русский язык.",
          f: "Неужели всё так плохо?"
        },

        /* Options
         ---------------------------*/
        show_QuestionCount: true,
        //buttons
        showBackButton: true,
        //show radio input
        showRadioButtons: true,
        //results
        showScoreRank: true,
        showScoreMessage: true,
        showViewResultsButton: true,

        /* Misc
         ---------------------------*/
        randomizeQuestions: true,
        randomizeAnswers: true,
      },
      /*----------------------------
          Class name strings
       ---------------------------*/
      class_disabled = "disabled",
      //quiz question elements
      class_quizQuestions = "quizQuestions",
      class_showQuestion = "showQuestion",
      class_questionCount = "questionCount",
      class_questionTitle = "questionTitle",
      class_questionAnswers = "questionAnswers",
      class_selectedAnswer = "selectedAnswer",
      //quiz control elements
      class_quizControls = "quizControls",
      class_ctrlPreviousButton = "ctrlPrev",
      class_ctrlNextButton = "ctrlNext",
      class_ctrlCompleteButton = "ctrlDone",
      //quiz results elements
      class_quizResults = "quizResults",
      class_quizScoreRank = "quizScoreRank",
      class_quizScore = "quizScore",
      class_quizScoreMessage = "quizScoreMessage",
      class_viewResultsButton = "viewResults",
      class_showingResults = "showingResults",

      /*----------------------------
          Class selectors
      ----------------------------*/
      //quiz question elements
      _questions = " ." + class_quizQuestions,
      _question = _questions + ' > li',
      _answers = " ." + class_questionAnswers,
      //quiz control elements
      _controls = " ." + class_quizControls,
      _ctrlPreviousButton = " ." + class_ctrlPreviousButton,
      _ctrlNextButton = " ." + class_ctrlNextButton,
      _ctrlCompleteButton = " ." + class_ctrlCompleteButton,
      //quiz results elements
      _results = " ." + class_quizResults,
      _viewResultsButton = " ." + class_viewResultsButton,
      _showingResults = " ." + _showingResults,

      /*----------------------------
          Element class selectors
      ----------------------------*/
      _quizQuestions = _element + _question,
      _quiz_answer = _element + _answers + ' li',
      //control buttons
      _quizCtrls = _element + _controls,
      _quizCtrlPreviousButton = _element + _ctrlPreviousButton,
      _quizCtrlNextButton = _element + _ctrlNextButton,
      _quizCompleteButton = _element + _ctrlCompleteButton,
      _quizViewResultsButton = _element + _viewResultsButton,
      //results
      _quizResults = _element + _results;

    plugin.config = $.extend( defaults, options );

    /*----------------------------
        Methods
    ----------------------------*/
    plugin.method = {
      buildQuiz: function ( data ) {
        var _quizHTML;

        //set quizData
        quizData = data;
        //set questions
        questions = plugin.method.createQuestions(quizData.questions, quizData.maxQuestions);
        // questions = plugin.config.randomizeQuestions ? plugin.method.randomizeArray( quizData.questions ) : quizData.questions;
        //set question count
        questionCount = questions.length;

        // add quiz class to $element
        if ( !$element.hasClass( "quiz" ) ) {
          $element.addClass( "quiz" );
        }

        /*----------------------------
            build quiz questions
        ----------------------------*/
        _quizHTML = '<ul class="' + class_quizQuestions + '">';

        //list of questions
        $.each( questions, function ( q ) {
          /*----------------------------
              quiz question data
          ----------------------------*/
          var question = questions[ q ];
          question.options = plugin.config.randomizeAnswers ? plugin.method.randomizeArray( question.options ) : question.options;

          /*----------------------------
              build question list
          ----------------------------*/
          _quizHTML += '<li';

          //show first question only
          _quizHTML += ( q === 0 ? ' class="' + class_showQuestion + '">' : '>' );

          //display question count
          if ( plugin.config.show_QuestionCount ) {
            _quizHTML += '<span class="' + class_questionCount + '">';
            _quizHTML += plugin.config.questionCount_text
              .replace( '%current_index', q + 1 )
              .replace( '%totalQuestions', questionCount );
            _quizHTML += '</span>';
          }

          //question title
          _quizHTML += '<h2 class="' + class_questionTitle + '">';
          // _quizHTML += question.q;
          _quizHTML += plugin.method.firstToUpperCase(question.q);
          _quizHTML += '</h2>';

          //answer options list
          _quizHTML += '<ul class="' + class_questionAnswers + '">';

          /*----------------------------
              build answers list
          ----------------------------*/
          $.each( question.options, function ( a ) {

            var _input_name = _element_id + '-q' + ( q + 1 ),
              _input_id = _input_name + '-a' + ( a + 1 );

            //build options list
            _quizHTML += '<li>';

            //build label
            _quizHTML += '<label for="' + _input_id + '">';

            //build radio input
            _quizHTML += '<input ';
            //show radio input
            _quizHTML += ( plugin.config.showRadioButtons ? '' : 'class="hidden" ' );
            //end show radio input

            _quizHTML += 'type="radio" name="';
            _quizHTML += _input_name + '"';
            _quizHTML += ' id="' + _input_id + '"';
            _quizHTML += ' value="' + question.options[ a ] + '">';

            //input value
            // _quizHTML += question.options[ a ];
            _quizHTML += plugin.method.firstToUpperCase(question.options[ a ]);
            _quizHTML += '</label>';
            //end label

            _quizHTML += '</li>';
            //end options list

          } );
          //end answers list
          _quizHTML += '</ul>';

          //end questions list
          _quizHTML += '</li>';

          q += 1;
        } );
        _quizHTML += '</ul>';

        /*----------------------------
            build quiz controls
        ----------------------------*/
        _quizHTML += '<div class="' + class_quizControls + '">';

        //previous button
        if ( plugin.config.showBackButton ) {
          _quizHTML += '<button class="' + class_ctrlPreviousButton + '">';
          _quizHTML += plugin.config.backButton_text + '</button>';
        }
        //next button
        _quizHTML += '<button class="' + class_ctrlNextButton + ' ' + class_disabled + '">';
        _quizHTML += plugin.config.nextButton_text + '</button>';
        //done button
        _quizHTML += '<button class="' + class_ctrlCompleteButton + ' ' + class_disabled + '">';
        _quizHTML += plugin.config.completeButton_text + '</button>';

        //close quiz controls
        _quizHTML += '</div>';

        /*----------------------------
            append quiz html
        ----------------------------*/
        $element.append( _quizHTML );

        /*----------------------------
            enable quiz events
        ----------------------------*/
        plugin.events.init();

      },
      createQuestions: function (questions, maxLength) {
        if (maxLength < questions.length) {
          let randomized = plugin.method.randomizeArray(questions);
          return randomized.slice(0, maxLength);
        } else return questions;
      },

      randomizeArray: function ( array ) {
        var m = array.length,
          t, i;

        // While there remain elements to shuffleÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦
        while ( m ) {

          // Pick a remaining elementÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦
          i = Math.floor( Math.random() * m-- );

          // And swap it with the current element.
          t = array[ m ];
          array[ m ] = array[ i ];
          array[ i ] = t;
        }

        return array;

      },
      buildQuizResults: function () {
        var resultsHTML = '',
          correctAnswerCount = 0,
          totalScore;

        function _checkAnswers() {
          //check each questions data
          $.each( questions, function ( index ) {
            //if answer === selected answer
            questions[ index ].answerCorrect = questions[ index ].selected === questions[ index ].a ? true : false;

            if ( questions[ index ].answerCorrect ) {
              //plus one to correct answer count
              correctAnswerCount += 1;
            } else {
              //else count stays the same
              correctAnswerCount = correctAnswerCount;
            }
          } );
          totalScore = ( correctAnswerCount / questionCount ) * 100;
        }
        _checkAnswers();
        /* build quiz results
        ----------------------------*/
        resultsHTML += '<div class="' + class_quizResults + '">';

        //quiz score rank
        resultsHTML += '<h1 class="' + class_quizScoreRank + '">';
        if ( totalScore > 80 ) {
          //rank 1: 80-100
          resultsHTML += plugin.config.quizScoreRank_text.a;
        } else if ( totalScore > 60 ) {
          //rank 2: 60-79
          resultsHTML += plugin.config.quizScoreRank_text.b;
        } else if ( totalScore > 40 ) {
          //rank 3: 40-59
          resultsHTML += plugin.config.quizScoreRank_text.c;
        } else if ( totalScore > 20 ) {
          //rank 4: 20-39
          resultsHTML += plugin.config.quizScoreRank_text.d;
        } else {
          //rank 5: 0-19
          resultsHTML += plugin.config.quizScoreRank_text.f;
        }
        resultsHTML += '</h1>';

        //quiz score total
        resultsHTML += '<p class="' + class_quizScore + '">';
        resultsHTML += plugin.config.quizScore_text
          .replace( '%totalScore', correctAnswerCount )
          .replace( '%totalQuestions', questionCount );
        resultsHTML += '</p>';
        //quiz score message
        if ( plugin.config.showScoreMessage ) {
          resultsHTML += '<p class="' + class_quizScoreMessage + '">';
          resultsHTML += plugin.config.quizScoreMessage_text;
          resultsHTML += '</p>';
        }
        //view results button
        if ( plugin.config.showViewResultsButton ) {
          resultsHTML += '<button class="' + class_viewResultsButton + '">';
          resultsHTML += plugin.config.viewResultsButton_text;
          resultsHTML += '</button>';
        }
        //add to DOM
        $element.append( resultsHTML );

        //if show view results button
        if ( plugin.config.showViewResultsButton ) {
          //init view results button event
          plugin.events.resultsButton();
        }
      },
      firstToUpperCase: function(str) {
        return str[0].toUpperCase() + str.slice(1);
      }
    };
    /*----------------------------
        Events
    ----------------------------*/
    plugin.events = {
      init: function () {
        this.controls.init();
        this.answerQuestion();
        this.checkQuestion();
      },
      controls: {
        DOM: function () {
          this.plugin = plugin.events;
          this.questionCount = questionCount - 1;
          //buttons
          this.$previous = $( _quizCtrlPreviousButton );
          this.$next = $( _quizCtrlNextButton );
          this.$complete = $( _quizCompleteButton );
          //all buttons
          this.$buttons = this.$previous
            .add( this.$next )
            .add( this.$complete );
        },
        init: function () {
          //cache button Elements
          this.DOM();

          var $buttons = this.$buttons,
            _this = this;

          $buttons.on( 'click', function () {
            var $button = $( this );

            //check if button disabled
            if ( _this.isNotDisabled( $button ) ) {
              //check button classname
              switch ( $button.attr( 'class' ) ) {
                //previous question
                case class_ctrlPreviousButton:
                  _this.plugin.previousQuestion();
                  break;
                  //next question
                case class_ctrlNextButton:
                  _this.plugin.nextQuestion();
                  break;
                case class_ctrlCompleteButton:
                  //hide questions and controls
                  $( _element + ' ' + _questions ).add( _quizCtrls ).remove();
                  //build results
                  plugin.method.buildQuizResults();
                  break;
              }
            }
          } );
        },
        isNotDisabled: function ( button ) {
          //check if button is not disabled
          return !button.hasClass( class_disabled ) ? true : false;
        },
        resetDisabled: function () {

          var totalAnswered = 0;

          switch ( question_index ) {
            case 0:
              this.$previous.addClass( class_disabled );
              this.$complete.hide();
              this.$next.show();
              break;
            case this.questionCount:
              this.$next.addClass( class_disabled ).hide();
              this.$previous.removeClass( class_disabled );
              this.$complete.show();
              break;
            default:
              this.$previous.removeClass( class_disabled );
              this.$next.show();
              this.$complete.hide();
              break;
          }

          this.$next = questions[ question_index ].selected !== undefined ?
            //remove disabled class
            this.$next.removeClass( class_disabled ) :
            //add disabled class
            this.$next.addClass( class_disabled );

          //                    //if answer selected
          //                    if (questions[question_index].selected !== undefined) {
          //                        //remove disabled class
          //                        this.$next.removeClass(class_disabled);
          //                    } else {
          //                        //add disabled class
          //                        this.$next.addClass(class_disabled);
          //                    }

          //check total answered questions
          $.each( questions, function ( i ) {
            //if question is answered
            totalAnswered = questions[ i ].selected ?
              //add one
              totalAnswered += 1 :
              //else total stays the same
              totalAnswered = totalAnswered;
          } );

          //if all questions answered
          if ( totalAnswered === questionCount ) {
            this.$complete.removeClass( class_disabled );
          }
        }
      },
      nextQuestion: function () {
        question_index += 1;
        this.checkQuestion();
      },
      previousQuestion: function () {
        question_index -= 1;
        this.checkQuestion();
      },
      checkQuestion: function () {
        //reset buttons
        this.controls.resetDisabled();
        //remove show question class
        $( _quizQuestions ).removeClass( class_showQuestion );
        //add show question class to current question
        $( $( _quizQuestions )[ question_index ] ).addClass( class_showQuestion );
      },
      answerQuestion: function () {

        function resetAnswerGroup( input ) {
          var _grpName = $( 'input:radio[name="' + input.prop( "name" ) + '"]' ),
            _inputParent = _grpName.parent().parent();

          //remove selected answer for input group
          _inputParent.removeClass( class_selectedAnswer );
        }

        $( _quiz_answer + ' input' ).on( 'click', function ( e ) {
          var _$answer = $( this ),
            _answerParent = _$answer.parent().parent();

          //reset input group
          resetAnswerGroup( _$answer );

          //add selected answer class
          _answerParent.addClass( class_selectedAnswer );

          //store answer value in quiz json data
          questions[ question_index ].selected = _$answer.val();
          //check question
          plugin.events.checkQuestion();
        } );
      },
      resultsButton: function () {
        $( _quizViewResultsButton ).on( 'click', function () {

          var resultsHTML;
          //remove view results button
          $( _quizViewResultsButton ).remove();

          //build results
          resultsHTML = '<h2>' + plugin.config.resultsHeader_text + '</h2>';
          resultsHTML += '<ul class="' + class_showingResults + '">';

          $.each( questions, function ( index ) {

            //question list
            resultsHTML += '<li class="';
            //if answer correct
            resultsHTML += questions[ index ].answerCorrect ?
              //give class answeredCorrect
              'answeredCorrect' :
              //else give class answeredWrong
              'answeredWrong';
            //close opening tag
            resultsHTML += '">';

            //question
            resultsHTML += '<h3 class="questionTitle">';
            resultsHTML += ( index + 1 ) + ". " + plugin.method.firstToUpperCase(questions[ index ].q);
            resultsHTML += '</h3>';

            //show answer
            resultsHTML += '<p>';
            //if answer was incorrect
            if ( !questions[ index ].answerCorrect ) {
              //display user answer
              resultsHTML += '<strong>Ваш ответ: </strong>';
              resultsHTML += plugin.method.firstToUpperCase(questions[ index ].selected) + '<br>';
            }
            //display correct answer
            resultsHTML += '<strong>Правильный ответ: </strong>';
            resultsHTML += plugin.method.firstToUpperCase(questions[ index ].a) + '<br>';
            //close p tag
            resultsHTML += '</p>';
            resultsHTML += '</li>';
          } );

          resultsHTML += '</ul>';
          $( _quizResults ).append( resultsHTML );

        } );
      }
    };

    //get quizData json
    if ( quizData ) {
      //external json file
      if ( typeof quizData === "string" ) {
        //get json data from url
        $.getJSON( quizData )
          //start quiz
          .then( function ( data ) {
            plugin.method.buildQuiz( data );
          } );
        //json quiz data
      } else if ( typeof options.quizData === "object" ) {
        //start quiz
        plugin.method.buildQuiz( quizData );
      } else {
        //change quizData to null
        quizData = null;
        //throw error message to console
        throw "Error: Check quizData for - " + _element;
      }
    }

  };
  $.fn.dlxQuiz = function ( options ) {
    return this.each( function () {
      var plugin = new $.dlxQuiz( this, options );
    } );
  };
}( jQuery ) );